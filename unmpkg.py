import os
import sys
import struct #解决大端序问题用的

fileLength=[]
fileName=[]
fileLocation=[]
fileContentLength=[]

# print(sys.argv[1])
dirName=sys.argv[1][:-5]
# print(dirName)
path=os.path.abspath(sys.argv[1])

def outputInfo(arg):
    print(type(arg))
    print(arg)

with open (path,"rb") as mpkg:
    mpkg.seek(0,0)
    versionBit= struct.unpack('<I', mpkg.read(4))
    # outputInfo(versionBit[0])
    
    version=mpkg.read(versionBit[0]).decode()
    # outputInfo(version)
    print("version "+version)
    print()
    
    fileCount=struct.unpack('<I', mpkg.read(4))[0]
    # outputInfo(fileCount)
    
    for i in range(0,fileCount):
    
        fileLength.append(struct.unpack('<I', mpkg.read(4))[0])
        # outputInfo(fileLength[i])
        
        fileName.append(mpkg.read(fileLength[i]).decode())
        # outputInfo(fileName[i])
        
        fileLocation.append(struct.unpack('<I', mpkg.read(4))[0])
        # outputInfo(fileLocation[i])
        
        fileContentLength.append(struct.unpack('<I', mpkg.read(4))[0])
        # outputInfo(fileContentLength[i])

    # print(mpkg.tell())

    outputDir="./"+dirName
    print("outputDir "+os.path.abspath(outputDir))
    os.makedirs(outputDir, exist_ok=True)   
     
    for i in  range(0,fileCount):
        with open(outputDir+"/"+fileName[i],"wb") as outputFile:
            # outputInfo(fileContentLength[i])
            outputFile.write(mpkg.read(fileContentLength[i]))
            print("fileName "+fileName[i])
            print("fileContentLength "+str(fileContentLength[i]))
            print()
