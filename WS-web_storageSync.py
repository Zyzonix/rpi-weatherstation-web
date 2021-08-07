#!/usr/bin/python3
#
# written by @author ZyzonixDev
# published by ZyzonixDevelopments 
# -
# date      | 20/06/2021
# python-v  | 3.7.3
# -
# file      | WS-web_storageSync.py
# project   | rpi-weatherstation-web
# version   | 0.2.0
#

import ftplib, threading, sys, os
from configparser import ConfigParser
from datetime import date, datetime

# the majority of this file is already explained under Zyzonix/rpi-weatherstation/core.py
class LogWriter(object):
    def __init__(self, *files):
        self.files = files
    def write(self, obj):
        for file in self.files:
            file.write(obj)
            file.flush()
    def flush(self):
        for file in self.files:
            file.flush()

class syncStorages():
    def getTime(self):
        curTime = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
        return curTime

    def syncMissing(self, mfileList, ftpConnection):
        leftToSync = mfileList
        try:
            for sfile in leftToSync:
                print(self.getTime(), "syncing the following database to to local storage: " + sfile)
                leftToSync.remove(sfile)
                downloadCMD = "RETR " + sfile
                newFileName = self.baseFilePath + "dataStorage/" + sfile
                newFile = open(newFileName, "w")
                newFile.close()
                ftpConnection.retrbinary(downloadCMD, open(newFileName, "wb").write)

            # checking if all databases have been synced, if not --> rerun (throwed an error before [some db's were left out], reason unknown - this method prevents this failure)
            if len(leftToSync) != 0:
                self.syncFinished = False
                syncStorages.syncMissing(self, leftToSync, ftpConnection)
                return
            else:
                self.syncFinished = True      
            print(self.getTime(), "syncing successful - all databases have been synced\n")    
        except Exception as e:
            print(self.getTime(), "something went wrong - was not able to sync missing databases\n")
            self.syncFinished = False
            print(e)
        self.syncFinished = True  
        ftpConnection.quit()

    def checkContent(self, rFileList, ftpConnection):
        localFileList = []
        for file in os.listdir(self.baseFilePath + "dataStorage/"):
            localFileList.append(file)

        remoteFileList = rFileList
        ftpConnection.voidcmd('TYPE I')

        toSync = []
        if not remoteFileList == localFileList:
            for file in remoteFileList:
                if not file in localFileList:
                    if file == "daily":
                        break
                    toSync.append(file)
        return toSync

    def getFTPContent(self, ftpConnection):
        ftpConnection.cwd(self.FTPshareLoc)
        existingFiles = []
        for filename in ftpConnection.nlst():
            existingFiles.append(filename)
        print(self.getTime(), "retrieved existing files of '" + self.FTPshareLoc + "' (number of existing files: " + str(len(existingFiles)) + ")") 
        return existingFiles

    def getFTPConnection(self):
        if self.syncFinished == False:
            print(self.getTime(), "last syncing process hasn't been finished yet\n")
            return False, 0
        try: 
            ftpConnection = ftplib.FTP(self.FTPServerIP)
            ftpConnection.login(self.FTPuname, self.FTPpwd)
            print(self.getTime(), "ftp connection successful, welcomemsg: " + ftpConnection.getwelcome())
            self.syncFinished = False   
            return True, ftpConnection
        except:
            print(self.getTime(), "something went wrong - was not able to initialize a ftp connection to: " + self.FTPServerIP + " - server may be offline\n")
            return False, 0 
    
    def handleSync(self):
        threading.Timer(self.SYNC_TIME, syncStorages.handleSync, [self]).start()
        print(self.getTime(), "scheduled next autorun for syncing databases from ftp share to local storage")
        connectionEstablished, ftpConnection = syncStorages.getFTPConnection(self)
        if connectionEstablished:
            existingFiles = syncStorages.getFTPContent(self, ftpConnection)
            leftToSync = syncStorages.checkContent(self, existingFiles, ftpConnection)
            syncStorages.syncMissing(self, leftToSync, ftpConnection)

    def __init__(self):
        configImport = ConfigParser(comment_prefixes='/', allow_no_value=True)
        configImport.read(os.getcwd() + "/setup/config.ini")
        self.SYNC_TIME = int(configImport["STORAGESYNC"]["synctime"])
        self.baseFilePath = configImport["STORAGESYNC"]["baseFilePath"]
        self.FTPServerIP = configImport["STORAGESYNC"]["FTPServerIP"]
        self.FTPshareLoc = configImport["STORAGESYNC"]["FTPShareLoc"]
        self.FTPuname = configImport["STORAGESYNC"]["uname"]
        self.FTPpwd = configImport["STORAGESYNC"]["pwd"]
        self.syncFinished = True

        self.logFile = open(self.baseFilePath + "logs/" + str(date.today()) + "_" + str(datetime.now().strftime("%H-%M-%S")) + "_storageSync_log.txt", "w")
        sys.stdout
        sys.stdout = LogWriter(sys.stdout, self.logFile)
        syncStorages.handleSync(self)


if __name__ == "__main__":
    syncStorages()