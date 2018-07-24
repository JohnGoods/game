#!/usr/bin/python
# coding=utf-8

import sys
import os
import os.path

CurrentPath = sys.path[0]
CommonScriptPath = "/data/config/protocol/"
ServerUrlFormat = "svn://192.168.1.254/h5mhxy/program/server/%s/scripts/include/protocol"
PATH_CONFIG_LIST = [
    ["resource", ServerUrlFormat % "trunk"]

]


def run_cmd(command):
    print command
    ret = os.system(command)
    if ret != 0:
        message = "Error running %s, return code: %s" % (command, str(ret))
        raise Exception(message)


if __name__ == '__main__':
    for i, info in enumerate(PATH_CONFIG_LIST):
        resourcePath = info[0]
        svnPath = info[1]

        resourcePath = os.path.join(CurrentPath, resourcePath)
        cspath = resourcePath + CommonScriptPath
        if os.path.exists(resourcePath) and not os.path.exists(cspath):
            run_cmd(
                "TortoiseProc.exe /command:checkout /path:\"%s\" /url:\"%s\"" % (cspath, svnPath))

    allcspath = ""
    if len(PATH_CONFIG_LIST) > 0:
        allcspath = os.path.join(
            CurrentPath, PATH_CONFIG_LIST[0][0]) + CommonScriptPath

    for i, info in enumerate(PATH_CONFIG_LIST):
        resourcePath = info[0]
        cspath = os.path.join(CurrentPath, resourcePath) + CommonScriptPath
        allcspath = allcspath + "*" + cspath

    if allcspath != "":
        run_cmd(
            "TortoiseProc.exe /command:update  /path:\"%s\" /closeonend:0" % allcspath)
