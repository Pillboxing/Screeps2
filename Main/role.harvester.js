var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var RepairTarget;
        switch(creep.memory.State)
        {
            case "Harvesting":
            {
                if(creep.carry.energy < creep.carryCapacity) 
                {
                    if (!creep.memory.source)
                    {
                        var NearestSource = creep.pos.NearestSource();
                        if (NearestSource != null)
                        {
                            creep.memory.source = NearestSource.id;                           
                        }
                        else
                        {
                            break;
                        }

                    }
                    var result =creep.harvest(Game.getObjectById(creep.memory.source));
                    if(result == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(Game.getObjectById(creep.memory.source));
                    }
                    if (result == ERR_NOT_ENOUGH_RESOURCES)
                    {
                        creep.memory.source = false;
                        break;
                    }

                }
                else
                {
                    creep.memory.source = false;
                    creep.memory.State = "DroppingOffResources";
                }
                                break;
            }
            case "DroppingOffResources":
            {
                if (creep.carry.energy == 0)
                {
                    creep.memory.State = "Harvesting";
                }
                                if(creep.transfer(creep.pos.findNearestFillableExtension(), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.pos.findNearestFillableExtension());
                    break;
                }
                if(creep.transfer(creep.room.spawn(), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.spawn());
                }

                if ( creep.room.energyAvailable == creep.room.energyCapacityAvailable)
                {
                    creep.memory.State = "Repairing";
                }

                break;
            }
            case "Building":
            {
                if (creep.carry.energy == 0)
                {
                    creep.memory.State = "Harvesting";
                }
                var currentTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (currentTarget)
                {
                   var result = creep.build(currentTarget);
                    creep.room.visual.line(creep.pos, currentTarget.pos,{color: 'red'});
                    var Percent = (currentTarget.progress/currentTarget.progressTotal)*100;
                    var Stringer = 'Building  - ' + Percent + '%';
                    creep.room.visual.text(Stringer,currentTarget.pos.x+1,currentTarget.pos.y,{align: 'left'});
                    if(result == ERR_NOT_IN_RANGE) 
                    {
                      creep.moveTo(currentTarget);
                        creep.say('Building.');
                    }
                }
                else
                {
                    creep.memory.State = "Upgrading";
                }
                break;
            }
            case "Repairing":
            {
                var RepairTarget;
                if (creep.carry.energy == 0)
                {
                    creep.memory.State = "Harvesting";
                }
                if (creep.memory.RepairTarget == false)
                {
                    RepairTarget = creep.pos.NearestRepairableStructure();
                    if (!RepairTarget)
                    {
                        creep.memory.State = "Building";
                    }
                    creep.memory.RepairTarget = RepairTarget.id;  
                }

                if (creep.memory.RepairTarget)
                {
                    RepairTarget = Game.getObjectById(creep.memory.RepairTarget)
                    var Result = creep.repair(RepairTarget);
                    var Percent = (RepairTarget.hits/RepairTarget.hitsMax)*100;
                    if ((RepairTarget.hits/RepairTarget.hitsMax) == 1)
                    {
                        creep.memory.RepairTarget = false;
                        creep.say('Job done');
                        break;
                    }
                    var Stringer = 'Repairing - ' + Percent + '%';
                    creep.room.visual.text(Stringer,RepairTarget.pos.x+1,RepairTarget.pos.y,{align: 'left'});
                    if (Result == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(RepairTarget);
                        creep.room.visual.line(creep.pos,RepairTarget.pos,{color: 'red'});
                        creep.say('crm');
                        return;
                    }
                    if (Result == 0)
                    {
                        creep.say('Repairing');
                        return;
                    }
                }
                else
                {
                    creep.memory.State = "Building";
                }
                break;
            }
            case "Fortifying":
            {
                break;
            }
            case "Upgrading":
            {
                if (creep.carry.energy == 0)
                {
                    creep.memory.State = "Harvesting";
                }
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                    creep.say('Moving.');
                }
                else
                {
                    creep.say("Upgrading.");
                }
                break;
            }
            default:
            {
                creep.memory.State = "Harvesting";
                break;
            }
        }
	   

	}

};

module.exports = roleHarvester;