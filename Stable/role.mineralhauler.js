/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.mineralhauler');
 * mod.thing == 'a thing'; // true
 */


module.exports = {
                run: function(creep)
                {
                    if (!creep.memory.from)
                    {
                        var Extractor = Game.getObjectById(creep.room.extractor());
                        console.log(Extractor.NearestCache());
                        creep.memory.from = Extractor.NearestCache().id;
                    }
                    if (!creep.memory.to)
                    {
                        creep.memory.to = creep.room.storage.id;
                    }
                    if (!creep.memory.hauling)
                    {
                        creep.memory.hauling = creep.pos.findClosestByRange(FIND_MINERALS).mineralType;
                    }
                    var HaulFrom = Game.getObjectById(creep.memory.from);
                    var HaulTo = Game.getObjectById(creep.memory.to);
                    if (_.sum(HaulFrom.store) == 0)
                    {
                        creep.memory.role = 'mover'
                        return;
                    }
                    if (_.sum(creep.carry) > 0 )
                    {
                        if (creep.transfer(HaulTo,creep.memory.hauling) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(HaulTo)
                        }
                    }
                    if (_.sum(creep.carry) == 0)
                    {
                        if (HaulFrom.LoadFromObjectToCreep(creep,creep.memory.hauling) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(HaulFrom);
                        }
                    }
                    //if our carry is empty move to haulfrom to refill
                }
};