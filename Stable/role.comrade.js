    var misc = require('misc');

var roleComrade = {
    /** @param {Creep} creep **/

    run: function(creep) {
                    var StorageFound ;
        	       var NearestContainer = creep.pos.NearestPickup();
        	          var TargetSource = Game.getObjectById(creep.memory.source);
        	       if (!NearestContainer)
        	       {
        	           NearestContainer = creep.pos.findClosestByRange(FIND_SOURCES);
        	           StorageFound = false;
        	       }
                else
                {
                    StorageFound = true;
                }
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
        var CurrentTarget = Game.getObjectById(creep.memory.target);
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
            console.log('Pillbot - Comrade out of energy.');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }
	            if (!creep.memory.building && StorageFound == false)
        {
            if(creep.harvest(TargetSource) == ERR_NOT_IN_RANGE) {
                
                creep.moveTo(TargetSource);
                return
            }
        }

	    if(creep.memory.building) {
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
	       var bFoundReppableRoad = false;
	       var x = 0;
	       var RepairTarget = Game.getObjectById(creep.memory.target);
	       if (!RepairTarget)
	       {
	           RepairTarget = creep.pos.NearestRepairableStructure();
	           if (RepairTarget)
	           {
	               creep.memory.target = RepairTarget.id;
	           }
	       }
            if (RepairTarget)
            {
                if (RepairTarget.hits == RepairTarget.hitsMax)
                {
                    creep.memory.target = null;
                    
                }
                var Result = creep.repair(RepairTarget);
                if (Result == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(RepairTarget);
                    creep.say('crm');
                    return;
                }
                if (Result == 0)
                {
                    creep.say('Repairing')
                    return;
                }
            }
            if (bFoundReppableRoad == false)
            {    

                /*var currentTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES,{filter: { structureType: STRUCTURE_EXTENSION }});
                if (!currentTarget)
                {
                    currentTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                }*/
               var currentTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

                if(currentTarget) 
                {
                    result = creep.build(currentTarget);
                    if(result == ERR_NOT_IN_RANGE) 
                    {
                      creep.moveTo(currentTarget);
                        creep.say('Building.');
                    }
                }
                else
                {
                    console.log('Failed to find construction site.');
                    creep.memory.role = 'builder';
                }
            }

	    }
	    else {

            if (!StorageFound)
            {
  
                if (creep.harvest(NearestContainer) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(NearestContainer);
                    return;
                }
            }
             var TransferAmount = 0;
             if (StorageFound == true && NearestContainer.store.energy < 200)
             {
                 creep.say('Wait');
                 return;
             }
            if (StorageFound && _.sum(NearestContainer.store) < (creep.carryCapacity - creep.carry.energy))
             {
                 TransferAmount = _.sum(NearestContainer.store);
             }
             else
             {
                 TransferAmount = creep.carryCapacity - creep.carry.energy;
             }
             var result = creep.withdraw(NearestContainer,RESOURCE_ENERGY,TransferAmount);
            if(result == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(NearestContainer);
                creep.say('Harvesting');
            }
	    }
	}
};

module.exports = roleComrade;