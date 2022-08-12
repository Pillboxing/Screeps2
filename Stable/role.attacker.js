/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attacker');
 * mod.thing == 'a thing'; // true
 */

var RoleAttacker = {
    run: function(creep)
    {
        var Target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (creep.attack(Target) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(Target);
        }
    }
};

module.exports = RoleAttacker;