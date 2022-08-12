/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run : function (creep)
    {
        if (!creep.memory.MineralType)
        {
            creep.memory.MineralType = creep.pos.findClosestByRange(FIND_MINERALS).mineralType;
        }
        var HaulTo = creep.pos.NearestCache();
        var TargetExtractor = creep.pos.findClosestByRange(FIND_MINERALS);
        var result = creep.harvest(TargetExtractor);
        if (result == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(TargetExtractor);
        }
        if (_.sum(creep.carry) == creep.carryCapacity && creep.transfer(HaulTo,creep.memory.MineralType) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(HaulTo);
        }
        //FIND EXTRACTORS
        //WRITE ROOM.EXTRACTOR OVERLOAD
        //Attempt to mine, if out of range, move to
        //if carry is full, drop off, if it's not, go harvest.
    }

};