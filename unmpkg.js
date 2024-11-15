const fs = require('fs');
const path = require('path');

// Получаем путь к файлу из аргументов командной строки
const filePath = process.argv[2];
const dirName = filePath.slice(0, -5); // Убираем последние 5 символов, как в оригинале

// Получаем абсолютный путь к файлу
const absolutePath = path.resolve(filePath);

function outputInfo(arg) {
    console.log(typeof arg);
    console.log(arg);
}

fs.open(absolutePath, 'r', (err, fd) => {
    if (err) throw err;

    const buffer = Buffer.alloc(4);

    // Чтение версии
    fs.read(fd, buffer, 0, 4, 0, (err, bytesRead) => {
        if (err) throw err;

        const versionBit = buffer.readUInt32LE(0);  // В Python был '<I'
        fs.read(fd, Buffer.alloc(versionBit), 0, versionBit, 4, (err, bytesRead, data) => {
            if (err) throw err;

            const version = data.toString('utf-8');
            console.log("version " + version);
            console.log();

            // Чтение количества файлов
            fs.read(fd, buffer, 0, 4, 4 + versionBit, (err, bytesRead) => {
                if (err) throw err;

                const fileCount = buffer.readUInt32LE(0);
                const fileLength = [];
                const fileName = [];
                const fileLocation = [];
                const fileContentLength = [];

                let offset = 8 + versionBit; // Начальный сдвиг

                // Чтение информации о файлах
                let fileDataReadCount = 0;
                function readFileInfo() {
                    if (fileDataReadCount === fileCount) {
                        // Все файлы прочитаны
                        const outputDir = path.resolve('./', dirName);
                        console.log("outputDir " + outputDir);

                        if (!fs.existsSync(outputDir)) {
                            fs.mkdirSync(outputDir, { recursive: true });
                        }

                        let fileReadOffset = offset;
                        for (let i = 0; i < fileCount; i++) {
                            // Чтение содержимого файла
                            fs.read(fd, Buffer.alloc(fileContentLength[i]), 0, fileContentLength[i], fileReadOffset, (err, bytesRead, data) => {
                                if (err) throw err;

                                const outputFilePath = path.join(outputDir, fileName[i]);
                                fs.writeFile(outputFilePath, data, (err) => {
                                    if (err) throw err;
                                    console.log("fileName " + fileName[i]);
                                    console.log("fileContentLength " + fileContentLength[i]);
                                    console.log();
                                });
                            });
                            fileReadOffset += fileContentLength[i];
                        }
                        return;
                    }

                    // Чтение данных для каждого файла
                    fs.read(fd, buffer, 0, 4, offset, (err, bytesRead) => {
                        if (err) throw err;

                        fileLength[fileDataReadCount] = buffer.readUInt32LE(0);
                        offset += 4;

                        fs.read(fd, Buffer.alloc(fileLength[fileDataReadCount]), 0, fileLength[fileDataReadCount], offset, (err, bytesRead, data) => {
                            if (err) throw err;

                            fileName[fileDataReadCount] = data.toString('utf-8');
                            offset += fileLength[fileDataReadCount];

                            fs.read(fd, buffer, 0, 4, offset, (err, bytesRead) => {
                                if (err) throw err;

                                fileLocation[fileDataReadCount] = buffer.readUInt32LE(0);
                                offset += 4;

                                fs.read(fd, buffer, 0, 4, offset, (err, bytesRead) => {
                                    if (err) throw err;

                                    fileContentLength[fileDataReadCount] = buffer.readUInt32LE(0);
                                    offset += 4;

                                    fileDataReadCount++;
                                    readFileInfo();
                                });
                            });
                        });
                    });
                }

                readFileInfo();
            });
        });
    });
});
