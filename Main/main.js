var roleHarvester = require('role.harvester');
var roleClaimer = require('role.claimer');
RoomPosition.prototype.NearestRepairableStructure = function()
{
    var target = this.findClosestByRange(FIND_STRUCTURES, {
    filter: function(object) {
        return ((object.hits/object.hitsMax) < .8 && object.structureType != STRUCTURE_WALL);
    }
        });
    return target;
}
RoomPosition.prototype.NearestSource = function()
{
    var target = this.findClosestByRange(FIND_SOURCES, {
    filter: function(object) {
        return (object.energy > 0 && object.pos.findInRange(FIND_MY_CREEPS,4).length  < 4);
    }
        });
    return target;
}
RoomPosition.prototype.findNearestFillableExtension = function()
{
    var target = this.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: function(object) {
        return (object.structureType == STRUCTURE_EXTENSION && object.energy < object.energyCapacity);
    }
});
return target;
}
RoomPosition.prototype.NearestDropOff = function()
{
    var targets = this.findClosestByPath(FIND_STRUCTURES, {
    filter: function(object) {
        if (object.structureType == STRUCTURE_CONTAINER)
        {
            return true;
        }
        if (object.structureType == STRUCTURE_STORAGE)
        {
            return true;
        }
        return false;
    }
});
return targets;
}
Room.prototype.spawn = function()
{
    return this.find(FIND_STRUCTURES,{filter: {structureType: STRUCTURE_SPAWN}})[0];
}
Room.prototype.spawncreep = function ()
{
     
    //Add emergency harvester spawning routines.
    if (!this.spawn())
    {
        return;
    }

   console.log('Spawning worker in room ' + this.name + '.');
    var x = 0;
    var Namer = "Worker";
    var intUtilityLimbs = 0;
    var creepers = this.find(FIND_MY_CREEPS);
    if (creepers.length < 1)
    {
        var x=0;
        var Result = this.spawn().createCreep([WORK,WORK, CARRY, MOVE], 'ScoobyDoo');
            while ( Result == -3)
        {
            x++;
            Namer = Namer + x;
            Result = this.spawn().createCreep(BodyArray, Namer,{RepairTarget: false})
        }
    }
    intUtilityLimbs = Math.floor((this.energyCapacityAvailable/2)/50);
    if (intUtilityLimbs%2 == 1)
    {
        intUtilityLimbs = intUtilityLimbs - 1;
    }
    if (intUtilityLimbs > 40)
    {
        intUtilityLimbs = 30
    }
    intUtilityLimbs;
    intUtilityLimbs = intUtilityLimbs * 50;
    var intWorkLimbs = Math.floor((this.energyCapacityAvailable-intUtilityLimbs)/100);


    var x = 0;
    intUtilityLimbs = intUtilityLimbs/50;
    var BodyArray = new Array();
    while (x < intWorkLimbs)
    {
        BodyArray.push('work');
        x++
    }
    x = 0;
    while (x < (intUtilityLimbs/2))
    {
        BodyArray.push('move');
        x++;
    }
        x = 0;

    while (x < (intUtilityLimbs/2))
    {
        BodyArray.push('carry');
        x++
    }
    //spawn a creep with this body. We'll make a different one for haulers
    x=0;
    var Result = this.spawn().createCreep(BodyArray, Namer,{RepairTarget: false})
    while ( Result == -3)
    {
        x++;
        Namer = Namer + x;
        Result = this.spawn().createCreep(BodyArray, Namer,{RepairTarget: false})
    }
    this.spawn().memory.LastTick = Game.time;
}
module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (name != 'Claimer')
        {
            roleHarvester.run(creep);
        }
        else
        {
            roleClaimer.run(creep);
        }
    }
    for (var name in Game.rooms)
    {
        var creepers = Game.rooms[name].find(FIND_MY_CREEPS);
        if (creepers.length < 6)
        {
            Game.rooms[name].spawncreep();
        }
    }

}