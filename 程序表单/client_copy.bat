::设置表单路径
set TARGET_PATH=D:\h5\program\client\trunk\2dgame\resource\language\zh-cn\data\config

xcopy %~dp0common\*.* %TARGET_PATH% /E /y /i
xcopy %~dp0client\*.* %TARGET_PATH% /E /y /i
::xcopy %~dp0server\Battle\SkillInfo.csv %TARGET_PATH%\skill /E /y /i
::xcopy %~dp0server\Monster\Monster.csv %TARGET_PATH%\skill /E /y /i

pause