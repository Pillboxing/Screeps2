var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleComrade = require('role.comrade');
var roleHauler = require('role.spawnhauler');
var roleClaimer = require('role.claimer');
var roleMover = require('role.spawnmover');
var roleMiner = require('role.miner');
var roleAttacker = require('role.attacker');
var roleMineralHauler = require('role.mineralhauler');
var x = 0;
var Namer = '';
var misc = require('misc');
var bFreeName;
var intNumberOfHarvesters;
var intNumberOfBuilders;
var intNumberOfComrades;
var intNumberOfSpawnHaulers;
RoomPosition.prototype.findNearestFillableExtension = function()
{
    var target = this.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: function(object) {
        return (object.structureType == STRUCTURE_EXTENSION && object.energy < object.energyCapacity);
    }
});
return target;
}
RoomPosition.prototype.NearestRepairableStructure = function()
{
    var target = this.findClosestByRange(FIND_STRUCTURES, {
    filter: function(object) {
        return ((object.hits/object.hitsMax) < .5 && object.structureType != STRUCTURE_WALL);
    }
        });
    return target;
}
RoomObject.prototype.LoadFromObjectToCreep = function(creep,Resource)
                {
                    if (!Resource)
                    {
                        var Resource = RESOURCE_ENERGY;
                    }
                var TransferAmount = 0;
             if (_.sum(this.store) < (creep.carryCapacity- _.sum(creep.carry)))
             {
                 TransferAmount = _.sum(this.store);
             }
             else
             {
                 TransferAmount = creep.carryCapacity - _.sum(creep.carry);
             }
            var result = creep.withdraw(this,Resource,TransferAmount);
            return result;

            }

RoomPosition.prototype.NearestCache = function() 
{
    var Cache;
    var Cache2;
    Cache = this.findClosestByPath(FIND_MY_STRUCTURES,{filter: {structureType: STRUCTURE_STORAGE}});
    Cache2 = this.findClosestByPath(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
    if (!Cache && !Cache2)
    {
        return
    }
    if (Cache && Cache2)
    {
        if (this.getRangeTo(Cache) > this.getRangeTo(Cache2))
        {
            return Cache2;
        }
        else
        {
            return Cache;
        }
    }
    if (!Cache)
    {
        return Cache2;
    }
    else
    {
        return Cache;
    }
}
RoomObject.prototype.NearestCache = function ()
{
    var Cache;
    var Cache2;
    var Cache3;
    Cache = this.pos.findClosestByPath(FIND_MY_STRUCTURES,{filter: {structureType: STRUCTURE_STORAGE}});
    Cache2 = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
    if (!Cache && !Cache2)
    {
        return
    }
    if (Cache && Cache2)
    {
        if (this.pos.getRangeTo(Cache) > this.pos.getRangeTo(Cache2))
        {
            return Cache2;
        }
        else
        {
            return Cache;
        }
    }
    if (!Cache)
    {
        return Cache2;
    }
    else
    {
        return Cache;
    }
}
RoomPosition.prototype.NearestDropOff = function()
{
    var targets = this.findClosestByPath(FIND_STRUCTURES, {
    filter: function(object) {
        if (object.structureType == STRUCTURE_LINK) 
        {
            return true;
        }
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
RoomPosition.prototype.NearestPickup = function()
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
Room.prototype.SellToNearestBuyOrder = function(Resource)
{
    var NearestOrder = this.FindNearestBuyOrder(Resource);
    var CostToSend = Game.market.calcTransactionCost(this.market.store)
}
Room.prototype.CalculateMarketCost = function(RoomName,ResourceAmount)
{
    
}
Room.prototype.FindNearestBuyOrder = function(Resource)
{
    var orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: Resource});
	var NearestOrder = orders[0];
	var Distance = 1000;
	var TempDistance = 0;
for(var i=0; i<orders.length; i++) {
    TempDistance = Game.map.getRoomLinearDistance(this.name,orders[i].roomName);
    if (TempDistance < Distance)
    {
        NearestOrder = order[i];
        Distance = TempDistance;
    }
    return NearestOrder;
}

}
Room.prototype.ExpectedHaulerLimbCount = function()
{
    var LimbCount = this.energyCapacityAvailable-100;
    var LimbCount = LimbCount/50;
    return LimbCount;
}
Room.prototype.extractor = function ()
{
    var Extractor = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTRACTOR}});
    if (Extractor[0])
    {
        return [Extractor[0].id];
    }
    else
    {
        return
    }
}

Room.prototype.SpawnTick = function ()
{
    if (this.controller.safeMode < 100 && this.controller.safeModeAvailable > 0)
    {
        this.controller.activateSafeMode();
    }
    if (this.spawn().spawning)
    {
        return;
    }
    var RoomStats = this.stats();
    //calculate total energy we can spend
    var RoomSpawn = this.spawn();
    
    if (RoomSpawn.memory.TotalSpawnEnergy < this.energyCapacityAvailable || !RoomSpawn.memory.TotalSpawnEnergy)
    {
        console.log('Updating spawn');
        this.UpdateSpawnParameters();
        return;
    }
    if (this.energyAvailable == 300)
    {
        if (RoomStats.Harvesters == 0)
        {
            console.log('SPAWN-Room.SpawnTick- Emergency harvester spawn.');
            this.spawncreep('harvester');
            return;
        }
            if (RoomSpawn.memory.NeedHauler == true && RoomStats.Haulers == 0)
        {
            this.spawncreep('hauler');
            return;
        }
        if (RoomStats.Builders == 0)
        {
            this.spawncreep('builder');
            return;
        }
    }




    if (this.energyAvailable == RoomSpawn.memory.TotalSpawnEnergy)
    {
                    if (RoomSpawn.memory.NeedMover == true && RoomStats.Movers == 0)
        {
            this.spawncreep('mover');
            return;
        }
        if (RoomSpawn.memory.HarvesterCount > RoomStats.Harvesters)
        {
            this.spawncreep('harvester');

            return;
        }

        if (RoomSpawn.memory.ComradeCount > RoomStats.Comrades)
        {
            this.spawncreep('comrade')
            return;
        }
        if (RoomSpawn.memory.NeedMiner == true && RoomStats.Miners == 0)
        {
            this.spawncreep('miner');
            return;
        }
        if (RoomSpawn.memory.NeedMover == true && RoomStats.Movers == 0)
        {
            this.spawncreep('mover');
            return;
        }
        
    }

}
Room.prototype.UpdateSpawnParameters = function ()
{
    this.spawn().memory.TotalSpawnEnergy = this.energyCapacityAvailable;
    var intUtilityLimbs = 0;
    intUtilityLimbs = Math.floor((this.energyCapacityAvailable/2)/50);
    if (intUtilityLimbs%2 == 1)
    {
        intUtilityLimbs = intUtilityLimbs - 1;
    }
    this.spawn().memory.intUtilityLimbs = intUtilityLimbs;
    intUtilityLimbs = intUtilityLimbs * 50;
    var intWorkLimbs = Math.floor((this.energyCapacityAvailable-intUtilityLimbs)/100);
    this.spawn().memory.intWorkLimbs = intWorkLimbs;
    this.spawn().memory.NeedHauler =  this.RequiresHauler();
    var Sources = this.find(FIND_SOURCES);
    //Unit count designation
    if (this.energyCapacityAvailable > 1500)
    {
        this.spawn().memory.HarvesterCount = Sources.length;
    }
    else
    {
        this.spawn().memory.HarvesterCount = (Sources.length*2)
    }
    this.spawn().memory.ComradeCount = (Sources.length*2);
    if (this.extractor())
    {
        this.spawn().memory.NeedMiner = true;
    }
    else
    {
        this.spawn().memory.NeedMiner = false;
    }
    if (Sources.length > 2)
    {
        //this.spawn().memory.NeedMover = true;
    }
    else
    {
        this.spawn().memory.NeedMover = false;
    }
}
Room.prototype.spawncreep = function (Role)
{
    //Add emergency harvester spawning routines.
    console.log('Spawning ' + Role + ' in room ' + this.name + '.');
           var x = 0;
       var Namer = Role;
    if (Role == 'harvester' && this.energyAvailable && this.stats().Harvesters == 0)
    {

        while (this.spawn().createCreep([WORK,WORK,CARRY,MOVE],Namer,{role: Role}) == -3)
        {
            x++;
            Namer = Role + x;
        }
    }
    if (Role == 'mover' || Role == 'hauler')
    {
        if (this.energyAvailable == this.energyCapacityAvailable)
        {
            var HalfBody = Math.floor((this.energyAvailable/2)/50);
            var x = 0;
            var BodyArray = new Array();
            while (x < HalfBody)
            {
                BodyArray.push('move');
                x++;
            }
            x = 0;
            while (x < HalfBody)
            {
                BodyArray.push('carry');
                x++
            }
            x = 0;
            var Namer = Role;
    
            while (this.spawn().createCreep(BodyArray,Namer, {role: Role}) == -3)
            {
                x++;
                Namer = Role + x;
            }
            return;
        }
        else
        {
            if (this.energyAvailable >= 300)
            {
                var Namer = Role;
                x=0;
                while (this.spawn().createCreep([MOVE,MOVE,MOVE,CARRY,CARRY,CARRY],Namer,{role: Role}) == -3)
                {
                    x++;
                    Namer = Role + x;
                }
            }
            return;
        }
    }
    var x = 0;
    var intUtilityLimbs = this.spawn().memory.intUtilityLimbs;
    var intWorkLimbs = this.spawn().memory.intWorkLimbs;
    var ExtraLimb = false;;
    var BodyArray = new Array();
    if (((intUtilityLimbs*50)+(intWorkLimbs*100)) < this.energyCapacityAvailable)
    {
        ExtraLimb = true;
    }
    while (x < intWorkLimbs)
    {
        BodyArray.push('work');
        x++
    }
    x = 0;
    if (ExtraLimb == false)
    {
        //x=x-1;
    }
    while (x < (intUtilityLimbs/2))
    {
        BodyArray.push('move');
        x++;
    }
        x = 0;
    if (ExtraLimb)
    {
        BodyArray.push('move');
    }
    else
    {
        //x=x+1;
    }
    while (x < (intUtilityLimbs/2))
    {
        BodyArray.push('carry');
        x++
    }
    //spawn a creep with this body. We'll make a different one for haulers
    var Namer = Role;
    x=0;
    while ( this.spawn().createCreep(BodyArray, Namer, {role: Role}) == -3)
    {
        x++;
        Namer = Role + x;
    }
}
Room.prototype.RequiresHauler = function ()
{
    var Structures = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
    if (Structures.length > 0)
    {
        return true;
    }
    Structures = this.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}});
    if (Structures.length > 0)
    {
        return true;
    }
    return false;
}

Room.prototype.LinkEnergy = function ()
{
    var Links = this.find(FIND_MY_STRUCTURES, {filter : {structureType: STRUCTURE_LINK}});
    for (var name in Links)
    {
        if (Links[name].energy >= 750 && (Links[name] != this.storage.pos.findClosestByPath(FIND_MY_STRUCTURES,{filter: {structureType: STRUCTURE_LINK}})))
        {
            this.TransferEnergy();
        }
    }
}
Room.prototype.TransferEnergy = function ()
{
    var Links = this.find(FIND_MY_STRUCTURES,{filter: {structureType: STRUCTURE_LINK}})
    var TransferTo = this.storage.pos.findClosestByPath(FIND_MY_STRUCTURES,{filter: {structureType: STRUCTURE_LINK}});
    for (var name in Links)
    {
        if (Links[name] != TransferTo && Links[name].energy >= 750)
        {
            var TransferFrom = Links[name];
        }
    }
    var result = TransferFrom.transferEnergy(TransferTo);
    return result;
    
}
Room.prototype.TowerDefense = function ()
{
        var Towers = this.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_TOWER}});
        var x = 0;
        while (x < Towers.length)
        {
            
            var Hostiles = this.find(FIND_HOSTILE_CREEPS);
            if (Hostiles.length > 0)
            {
                console.log('HOSTILES FOUND!');
                Towers[x].attack(Hostiles[0]);
            }
            x++;
        }
    
}
Room.prototype.Hostiles = function ()
{
    var Hostiles = this.find(FIND_HOSTILE_CREEPS);
    return Hostiles;
}
Room.prototype.LowEnergyTowers = function ()
{
        var Towers = this.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_TOWER}});
        var LowTowers = [];
        for (var name in Towers)
        {
            if (((Towers[name].energy*100)/Towers[name].energyCapacity) < 50)
            {
                LowTowers.push(Towers[name]);
            }
        }
        return LowTowers;
}
Room.prototype.Harvesters = function ()
{
    var creepers = this.find(FIND_MY_CREEPS);
    var Harvesters = []
    for (var name in creepers)
    {
        if (creepers[name].memory.role == 'harvester') 
        {
            Harvesters.push(creepers[name]);
        }
    }
    return Harvesters;
}
Room.prototype.Comrades = function ()
{
    var creepers = this.find(FIND_MY_CREEPS);
    var Harvesters = []
    for (var name in creepers)
    {
        if (creepers[name].memory.role == 'comrade' || creepers[name].memory.role == 'builder') 
        {
            Harvesters.push(creepers[name]);
        }
    }
    return Harvesters;
}
Room.prototype.spawn = function()
{
    return this.find(FIND_STRUCTURES,{filter: {structureType: STRUCTURE_SPAWN}})[0];
}
    Room.prototype.stats = function() 
    {
        var intComradeCount=0;
        var intHarvesterCount=0;
        var intBuilderCount=0;
        var intHauler=0;
        var intMovers=0;
        var intMiners=0;
        var creepers =  this.find(FIND_MY_CREEPS);
        var x = 0;
        while (x < creepers.length)
        {
            switch (creepers[x].memory.role)
            {
                case 'comrade':
                    intComradeCount++;
                    break;
                case 'builder':
                    intComradeCount++;
                    intBuilderCount++;
                    break;
                case 'harvester':
                    intHarvesterCount++;
                    break;
                case 'hauler':
                    intHauler++;
                    break;
                case 'mover':
                    intMovers++;
                    break;
                case 'miner':
                    intMiners++;
                    break;
            }
            x++
        }
    return {
        Builders: intBuilderCount,
        Comrades: intComradeCount,
        Harvesters: intHarvesterCount,
        Haulers: intHauler,
        Movers: intMovers,
        Miners: intMiners
    };
};
module.exports.loop = function () {
    
    var bSpawn = true;
    intNumberOfHarvesters = 0;
    intNumberOfBuilders = 0;
    intNumberOfComrades = 0;
    intNumberOfSpawnHaulers = 0;
   // console.log(Game.cpu.getUsed());
    for(var name in Game.creeps) {
        //console.log(Game.cpu.getUsed());
        var creep = Game.creeps[name];
        if (creep.memory.role == 'hauler')
        {
            if (roleHauler.run(creep) == true)
            {
                bSpawn = false;
            }
        }
        if(creep.memory.role == 'harvester') {
            if (roleHarvester.run(creep) == true)
            {
                bSpawn = false;
            }

        }
        if (creep.memory.role == 'claimer')
        {
            roleClaimer.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'comrade')
        {
            roleComrade.run(creep);
        }
        if (creep.memory.role == 'miner')
        {
            roleMiner.run(creep);
        }
        if (creep.memory.role == 'mineralhauler')
        {
            roleMineralHauler.run(creep);
        }
        if (creep.memory.role == 'mover')
        {
            if (roleMover.run(creep) == true)
            {
                bSpawn = false;
            }
        }
        if (creep.memory.role == 'attacker')
        {
            roleAttacker.run(creep);
        }
      //  console.log('Executing ' + creep.memory.role + ' ' + Game.cpu.getUsed());
        

    }

    var SpawnCounter = 0;
    var RoomStats;
    if (bSpawn == false)
    {
        return;
    }
    for (var name in Game.rooms)
    {
        if (!Game.rooms[name].spawn())
        {
            continue;
        }
        Game.rooms[name].LinkEnergy();
        Game.rooms[name].TowerDefense();
       Game.rooms[name].SpawnTick();

        
        
    }
 
    
}