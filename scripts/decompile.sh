#!/bin/sh

export DofusInvoker="/media/didilehbal/2A14F31614F2E42B/Users/Hors/AppData/Local/Ankama/zaap/dofus/DofusInvoker.swf"
export selectclass='com.ankamagames.dofus.BuildInfos,com.ankamagames.dofus.network.++,com.ankamagames.jerakine.network.++'
export config='parallelSpeedUp=0'

#cd "$( dirname "${BASH_SOURCE[0]}" )"
#cd ..

/usr/bin/ffdec \
  -config "$config" \
    -selectclass "$selectclass" \
      -export script \
        ./sources $DofusInvoker
