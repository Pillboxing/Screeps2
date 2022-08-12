                    var misc = require('misc');
var roleBuilder = {


   /** @param {Creep} creep **/
    run: function(creep) {
            var StorageFound;
	       var NearestContainer = creep.pos.NearestPickup();
	               	          var TargetSource = Game.getObjectById(creep.memory.source);
	               	          if (!TargetSource)
         {
             creep.say('search');
             var Sources = creep.room.find(FIND_SOURCES);
             var CounterArray = [] ;
             var x = 0
             while (x < Sources.length)
             {
                 CounterArray.push(0);
                 x++
             }
             x=0;
             if (Sources.length > 1)
             {
                 var SourceArray = creep.room.Comrades();
                 for (var name in SourceArray)
                 {
                    CounterArray[Sources.indexOf(Game.getObjectById(SourceArray[name].memory.source))]++;
                 }
                 while (x < CounterArray.length)
                 {
                                        if (CounterArray[x] < 3)
                                        {
                                            console.log('Pillbot - Harvester setting target source to ' + Sources[x].id + '.');
                                            creep.memory.source = Sources[x].id;
                                             TargetSource = Sources[x];
                                             return;
                                        }
                     x++;
                 }
             }
             else
             {
                 creep.memory.source = Sources[0].id;
                 TargetSource = Sources[0];
             }
             
         }
	       if (creep.carry.energy == 0)
	       {
	           creep.memory.reloading = true;
	       }
	       if (creep.carry.energy == creep.carryCapacity)
	       {
	           creep.memory.reloading = false;
	       }
	       if (!NearestContainer)
	       {
	           StorageFound = false;
	           NearestContainer = creep.pos.findClosestByPath(FIND_SOURCES);
	       }
	       else
	       {
	           StorageFound = true;
	       }

	    if(creep.memory.reloading) {


             var TransferAmount = 0;
             if (StorageFound && _.sum(NearestContainer.store) < 200  )
             {
                 creep.say('Wait');
                 return;
             }
            if (StorageFound && _.sum(NearestContainer.store) < creep.carryCapacity)
             {
                 TransferAmount = _.sum(NearestContainer.store);
             }
             else
             {
                 TransferAmount = creep.carryCapacity;
             }
            if (!StorageFound)
            {
                if (creep.harvest(TargetSource) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(TargetSource);
                    return;
                }
            }
             var result = creep.withdraw(NearestContainer,RESOURCE_ENERGY,TransferAmount);
            if(result == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(NearestContainer);
                creep.say('Harvesting');
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
                creep.say('Moving.');
            }
            else
            {
                creep.say("Upgrading.");
            }
        }
	}
};

module.exports = roleBuilder;