#!/bin/sh

export DofusInvoker="C:\Users\habil\AppData\Local\Ankama\zaap\dofus\DofusInvoker.swf"
export selectclass='com.ankamagames.dofus.BuildInfos,com.ankamagames.dofus.network.++,com.ankamagames.jerakine.network.++'
export config='parallelSpeedUp=0'

#cd "$( dirname "${BASH_SOURCE[0]}" )"
#cd ..

C:/'Program Files (x86)'/FFDec/ffdec \
  -config "$config" \
    -selectclass "$selectclass" \
      -export script \
        ./sources $DofusInvoker
