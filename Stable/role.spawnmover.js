
var roleHauler = {

    RefillSpawn: function(creep){
    },
     run: function(creep) {
                     var HaulTo = Game.getObjectById(creep.memory.HaulTo);
            var HaulFrom = Game.getObjectById(creep.memory.HaulFrom);
            if (!HaulFrom)
            {
                HaulFrom = creep.pos.NearestPickup();
                creep.memory.HaulFrom = creep.pos.NearestPickup().id;
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
    
        
         if (creep.memory.state == 'reloading')
         {            if (creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.state = 'hauling';
            }
            else
            {
                console.log(creep.carry.energy);
            }
                      	        var targets = creep.room.find(FIND_DROPPED_RESOURCES);
         	        if (targets.length > 0 && creep.carry.energy < creep.carryCapacity && creep.pos.getRangeTo(targets[0]) < 15)
         	        {
                            creep.moveTo(targets[0]);
                            creep.pickup(targets[0]);
                            creep.say('scavenging');
                            return;
         	        }
            var NearestContainer = HaulFrom;
            var TransferAmount = 0;
            if (creep.carry.energy < creep.carryCapacity)
            {
                var result = misc.LoadFromObjectToCreep(creep,NearestContainer);
                if (result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(NearestContainer)
                }
            }


            
         }
         if (creep.memory.state == 'hauling')
         {
                      if (creep.carry.energy == 0)
                      
         {
             console.log('SpawnHauler reloading.');
             creep.memory.state = 'reloading';
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
                // else
              //   {
               //      creep.memory.role = 'mineralhauler'
               //  }
              
             }
         }
     
     }
};
module.exports = roleHauler;