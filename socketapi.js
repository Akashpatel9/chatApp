const io = require( "socket.io" )();
const userModel = require("./routes/users");
const messageModel = require('./routes/message')

const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );

    socket.on('join-server',async(userId)=>{
        const data = await userModel.findOneAndUpdate({_id:userId},{sockedId:socket.id});
    });

    socket.on('send-private-message', async(message)=>{

        const msgId = await messageModel.create({
            sender:message.sender,
            user:message.reciever,
            data:message.message
        });

        const recieverId = await userModel.findOne({
            _id:message.reciever
        });

        const senderId = await userModel.findOne({
            _id:message.sender
        });

        recieverId.messages.push(msgId._id);
        senderId.messages.push(msgId._id);

        await senderId.save();
        await recieverId.save();

        // console.log(msgId._id);

        // console.log(recieverId.sockedId);

        socket.to(recieverId.sockedId).emit('recieve-private-message',message);
    });

});
// end of socket.io logic

module.exports = socketapi;