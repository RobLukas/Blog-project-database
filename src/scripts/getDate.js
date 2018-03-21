var currentdate = new Date(); 
exports.datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate();
                //  + " @ "  
                // + currentdate.getHours() + ":"  
                // + currentdate.getMinutes() + ":" 
                // + currentdate.getSeconds();