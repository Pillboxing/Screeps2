Add profiling with basic satistics over variable time signatures (1000 ticks, 500, 50, etc, start optimising)l
modify spawnhauler code to make whichever one is closer to go to bighaul mode, put the routine to modify the creeps role in memory
in the transfer routine
Run memory cleanup code every 500 ticks
write code to make comrades dismantle tiles with certain flags on them
add guard required code to spawn and set them to patrol
CLEANUP CODE:
for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}