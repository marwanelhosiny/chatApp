import Chat from "../../../DB/models/chat.model.js";
import Message from "../../../DB/models/message.model.js";



//======================= creating api send message =================//

export const sendMessage = async (req, res, next) => {
    const { chatId, content } = req.body;
    const { _id } = req.authUser;

    if (!content || !chatId) {
        return next(new Error("Invalid content", { cause: 400 }));
    }

        const messageCreated = await Message.create({ chat: chatId, content, sender: _id });
        let message = await Message.findById(messageCreated._id).lean()
            .populate('sender', 'name pic email')
            .populate({
                path: 'chat',
                populate: {
                    path: 'users',
                    select: '-password' // Excludes the password from the selection
                }
            });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.status(201).json(message);
    
};



//======================= fetching all messages =================//

export const fetchAllMessages = async (req, res, next) => {
    const { chatId } = req.params;
    let messages = await Message.find({ chat: chatId })
        .populate('sender', 'name pic email')
        .populate('chat');


    res.status(200).json(messages);
};
