/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.claimer');
 * mod.thing == 'a thing'; // true
 */
var roleClaimer =
{
    run: function(creep)
    {
        if (creep.room.name != 'E83S44')
        {
                creep.moveTo(new RoomPosition(46,27, 'E83S44'));
                return;
        }
        creep.memory.role = 'comrade'
        if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(creep.room.controller);
        }
    }
}
module.exports = roleClaimer;