/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('misc');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    ProcessHaulerState: function(creep,state)
    {
        
    },
                LoadFromCreepToObject: function(creep,structure)
                {
                    var result = creep.transfer(structure,RESOURCE_ENERGY);
                    return result;
                },
                
                            LoadFromObjectToCreep: function(creep,structure){
                var TransferAmount = 0;
             if (_.sum(structure.store) < (creep.carryCapacity- creep.carry.energy))
             {
                 TransferAmount = _.sum(structure.store);
             }
             else
             {
                 TransferAmount = creep.carryCapacity - creep.carry.energy;
             }
            var result = creep.withdraw(structure,RESOURCE_ENERGY,TransferAmount);
            return result;

            }
           
}

;