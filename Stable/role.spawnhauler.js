
var roleHauler = {

    RefillSpawn: function(creep){
    },
     run: function(creep) {
                     var HaulTo = Game.getObjectById(creep.memory.HaulTo);
            var HaulFrom = Game.getObjectById(creep.memory.HaulFrom);
            if (!HaulFrom)
            {
                HaulFrom = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_LINK  }});
            }
            if (!HaulFrom)
            {
                HaulFrom = creep.room.storage;
            }
            if (!HaulTo)
            {
               HaulTo = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_STORAGE }});
            }
            if (!HaulTo)
            {
                HaulTo = Game.getObjectById('584cb08923c368d6126c6b4a');
            }

            var misc = require('misc');
         if (creep.body.length < creep.room.ExpectedHaulerLimbCount() && creep.room.energyAvailable == creep.room.energyCapacityAvailable)
         {
             console.log('killing temporary hauler');
             creep.suicide();
             return true;
         }
        var targer = HaulFrom;
        if (!creep.memory.state)
        {
            creep.memory.state = 'reloading';
        }
        if (targer && targer.energy > 500 && creep.memory.state != 'bighaul')
        {
            console.log('Pillbot - Hauling from link to storage');
            creep.memory.state = 'bighaul';
        }
    
         if (creep.memory.state == 'bighaul')
         {
             creep.say('bighaul');
            if (HaulTo == HaulFrom)
            {
                creep.memory.state = 'reloading';
            }
        

            if (creep.carry.energy == 0)
            {
                result = misc.LoadFromObjectToCreep(creep,HaulFrom);
                if (result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(HaulFrom);
                }

            }
            else
                {
                   result = misc.LoadFromCreepToObject(creep,HaulTo);
                   if (result == ERR_NOT_IN_RANGE)
                   {
                       creep.moveTo(HaulTo);
                   }
                }
                             if (HaulFrom.energy == 0 && creep.carry.energy == 0)
            {
                    creep.memory.state = 'reloading';
                    console.log('Moving from spawn to extensions');
            }
         }
         if (creep.memory.state == 'reloading')
         {
            if (_.sum(creep.carry) > creep.carry.energy)
            {
                for(var resourceType in creep.carry) {
	                creep.transfer(HaulTo, resourceType);
                }
            }
                      	        var targets = creep.room.find(FIND_DROPPED_RESOURCES);
         	        if (targets.length > 0 && creep.carry.energy < creep.carryCapacity)
         	        {
                            creep.moveTo(targets[0]);
                            creep.pickup(targets[0]);
                            creep.say('scavenging');
                            return;
         	        }
            var NearestContainer = HaulTo;
            var TransferAmount = 0;
            if (NearestContainer.store.energy == 0 && creep.carry.energy < creep.carryCapacity)
            {
                var NearestCache = HaulTo;
                if (NearestCache.energy > 500)
                {
                    creep.memory.state = 'bighaul';
                    console.log('Hauling from cache to spawn cache.');
                }
            }
            if (creep.carry.energy < creep.carryCapacity)
            {
                var result = misc.LoadFromObjectToCreep(creep,NearestContainer);
                if (result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(NearestContainer)
                }
            }
            else
            {
                creep.memory.state = 'hauling';
            }

            
         }
         if (creep.memory.state == 'hauling')
         {
                      if (creep.carry.energy == 0 || (HaulFrom && _.sum(HaulFrom.store) > 1500 && _.sum(HaulTo.store) < 500)  && (HaulTo != HaulFrom))
                      
         {
             console.log('bighaul');
             creep.memory.state = 'bighaul';
             return;
         }
         var RepTowers = creep.room.LowEnergyTowers()
            if (RepTowers[0])
            {
                console.log(RepTowers[0]);
               creep.say('Tower');
               var Result = misc.LoadFromCreepToObject(creep,RepTowers[0]);
                if (Result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(RepTowers[0]);
                }
                return;
            }
            var NearestExtension = creep.pos.findNearestFillableExtension();
            if (NearestExtension)
            {
                var Result = creep.transfer(NearestExtension,RESOURCE_ENERGY);
                           if (Result == ERR_NOT_IN_RANGE)
                           {
                               creep.moveTo(NearestExtension);
                               creep.say('HME');
                               return;
                           }
            }

            if (!NearestExtension)
            {
                var Target = creep.room.spawn();
                if (Target.energy < 300)
                {
                    var result = creep.transfer(Target,RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE)
                     {
                         creep.moveTo(Target);
                         creep.say('HMS');
                     }
                 }
              
             }
         }
     
     }
};
module.exports = roleHauler;