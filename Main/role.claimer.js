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
        if (creep.room.name != 'W31S59')
        {
                creep.moveTo(new RoomPosition(20,20, 'W31S59'));
                return;
        }
        else
        {
             creep.moveTo(creep.room.controller);
             creep.claimController(creep.room.controller);
        }
    }
}
module.exports = roleClaimer;