var roleHarvester = {
    
    PickSource: function(creep){
        Sources = creep.room.find(FIND_SOURCES);
    },
    /** @param {Creep} creep **/
    
    run: function(creep) {
        var misc = require('misc');
                var TargetSource = Game.getObjectById(creep.memory.source);
                 if (creep.body.length < (creep.room.spawn().memory.intUtilityLimbs + creep.room.spawn().memory.intWorkLimbs) && creep.room.energyAvailable == creep.room.energyCapacityAvailable)
         {
             console.log('killing temporary harvester');

            creep.suicide();
            return true;
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
                 var SourceArray = creep.room.Harvesters();
                 for (var name in SourceArray)
                 {
                    CounterArray[Sources.indexOf(Game.getObjectById(SourceArray[name].memory.source))]++;
                 }
                 while (x < CounterArray.length)
                 {
                                        if (CounterArray[x] < 2)
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
        var LinkFound;
        var NearestContainer = creep.pos.NearestDropOff();
        if (!NearestContainer && !creep.room.storage)
        {
            //NearestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER}})
        }
        if (!NearestContainer && creep.room.storage)
        {
            NearestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter : {structureType: STRUCTURE_STORAGE}});
        }
        if (!NearestContainer)
        {
            NearestContainer = creep.room.spawn();
            LinkFound = false;
        }
        else
        {
            LinkFound = true;
        }
	    if(creep.memory.Restock) 
	    {
	        if (creep.carry.energy == creep.carryCapacity)
	        {
	            creep.memory.Restock = false;
	            return;
	        }
	        var targets = creep.room.find(FIND_DROPPED_RESOURCES);
            if(targets.length)
            {
                if (creep.pos.getRangeTo(targets[0]) < 5)
                {
                    creep.moveTo(targets[0]);
                    creep.pickup(targets[0]);
                    return;
                }
            
            }
            var source = TargetSource ;
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                
                creep.moveTo(source);
            }
        }
        else
        {
            if (creep.carry.energy == 0)
            {
                creep.memory.Restock = true;
            }
            var Result = creep.transfer(NearestContainer, RESOURCE_ENERGY);
            if (LinkFound == false)
            {
                var extensions = creep.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION}});
                var x = 0;
                var intFullCounter = 0;
                while (x < extensions.length)
                    {
                        if (extensions[x].energy < extensions[x].energyCapacity)
                        {
                            var Result = creep.transfer(extensions[x],RESOURCE_ENERGY);
                               if (Result == ERR_NOT_IN_RANGE)
                               {
                                   creep.moveTo(extensions[x]);
                                   creep.say('HME');
                                   return;
                               }
                               if (Result == OK)
                               {
                                   console.log('Pillbot - Harvester dropping off energy to extension in room' + creep.room.name);
                                   break;
                               }
                        }
                        else
                        {
                            intFullCounter++;
                        }
                        x++;
                    }
                if (intFullCounter == extensions.length)
                {
                    var result = ERR_FULL;
                }
    
                if (result == ERR_FULL)
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
                     else
                     {
                        creep.moveTo(Target);
                     }
                  
                 }
                 return;
        }
            if(Result == ERR_NOT_IN_RANGE) {
                creep.moveTo(NearestContainer);
                creep.say('Container');
            }
            
                    

           if (Result == OK)
            {
                console.log('Pillbot - Worker dropping off energy');
            }
        }    
    }
};

module.exports = roleHarvester;