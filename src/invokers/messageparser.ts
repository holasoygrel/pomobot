import { prefix } from "../config";
import { Arguments } from "./MessageInv";

export let parseArguments = (messageContent: string) : Arguments => {
    //remove command prefix
    let content = messageContent.slice(prefix.length);
    let args = content.split(' ').filter((argument) => argument.length > 0 ); 

    console.log("argumentos", args)
    let workTime = 0, breakTime = 0;
    let command = args[0].toLowerCase();
    let isGroup = false;
    
    // console.log("COMANDO:", command);

    
    //pom 20 break 20
    if(args.length >= 4 && args[2] === 'break') {
        
        let parsedWorkTime = parseInt(args[1]);
        let parsedBreakTime = parseInt(args[3]);
        workTime = (isNaN(parsedWorkTime)) ? 0 : parsedWorkTime;
        breakTime = (isNaN(parsedBreakTime)) ? 0 : parsedBreakTime;

    } else if(args.length >= 2) {
        if(
            (args.length === 3 && command === "grupo" && args[1] === "pom" && args[2] === "pom") || 
            (command == "pom" && args[1] === 'pom')
        ) {
            workTime = 50;
        } else if(command === "grupo" && args[1] === "pom") {
            workTime = 25;
        } else if(command === "cancelar" && args[1] === "grupo") {
            isGroup = true;
        } else {
            workTime = parseInt(args[1]);
        }
    }

    if(args[0] === "grupo" && args[1] === "cancelar") {
        command = "cancelar";
        workTime = 0;
        breakTime = 0;
        isGroup = true;
    }

    return {
        command: command,
        workTime: workTime,
        breakTime: breakTime,
        isGroup: isGroup
    };
};