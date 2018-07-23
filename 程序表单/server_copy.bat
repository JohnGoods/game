::设置表单路径
set TARGET_PATH=Z:\server\data\csv

xcopy %~dp0common\*.* %TARGET_PATH% /E /y /i
xcopy %~dp0server\*.* %TARGET_PATH% /E /y /i
::xcopy %~dp0server\Battle\SkillInfo.csv %TARGET_PATH%\skill /E /y /i
::xcopy %~dp0server\Monster\Monster.csv %TARGET_PATH%\skill /E /y /i

pause