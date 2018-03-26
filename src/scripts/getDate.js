var currentdate = new Date(); 
exports.date = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate();
                //  + " @ "  
                // + currentdate.getHours() + ":"  
                // + currentdate.getMinutes() + ":" 
                // + currentdate.getSeconds();