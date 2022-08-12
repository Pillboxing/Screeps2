/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.hauler');
 * mod.thing == 'a thing'; // true
 */


module.exports = {
    run : function(creep)
    {
        if (creep.memory.state = '')
        {
            //initialize?
            //check mode
        }
        switch (creep.memory.mode)
        {
            case 'workhorse':
                //do stuff
                break;
            case 'minerhauler':
                //do stuff
                break;
            case 'dedicated':
                //do stuff
                break;
            case 'terminal':
                //do stuff
                break;
            
        }
    }

};