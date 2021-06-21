export const clean = async(message, numberToclean: number) =>{

    let numbertoDelete = numberToclean === 0 ? 100 : numberToclean; 
    
    message.channel.bulkDelete(numbertoDelete)
                .then(messages =>{
                    message.channel.send(`se han borrado ${messages.size} mensajes`)
                })
                .catch( error =>{
                    console.error
                    message.channel.send('error al borrar, los mensajes, tienen mas de 14 dias de antigüedad');
                });
}