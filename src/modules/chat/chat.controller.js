import Chat from "../../../DB/models/chat.model.js"
import User from "../../../DB/models/user.model.js"
import Message from "../../../DB/models/message.model.js"


//======================= creating api to access chat or create it if not exist ==============//
export const accessChat = async (req, res, next) => {
    const { userId } = req.body;
    const { _id } = req.authUser;

    // Check if user exists
    const user = await User.findOne({ _id: userId });
    if (!user) {
        return next(new Error('User not found', { cause: 400 }));
    }

    // Check if chat exists
    let chat = await Chat.findOne({ isGroup: false, users: { $all: [_id, userId] } })
        .populate('users', '-password')
        .populate({
            path: 'latestMessage',
            populate: {
                path: 'sender',
                select: 'name pic email'
            }
        });

    // If chat does not exist
   if(!chat) {
        // Create chat if it does not exist
        const chatData = {
            isGroup: false,
            users: [userId, _id],
            chatName: user.name // Assuming you want to use the user's name as the chatName
        };
        const createdChat = await Chat.create(chatData);

        // Populate the newly created chat
        let newChat = await Chat.findById(createdChat._id)
            .populate("users", "-password");


        return res.status(200).json(newChat);
    }

    res.status(200).json(chat);
};



//========================================== fetching user's all chats ==========================================//
export const fetchAllChats = async (req, res, next) => {
    const { _id } = req.authUser;
    const results = await Chat.find({ users: { $all: [_id] } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "name pic email" // Ensure 'pic' is selected here
            }
        })
        .sort({ updatedAt: -1 });



    return res.status(200).json(results);
};



//========================================== create group chat ================================//
export const createGroupChat = async (req, res, next) => {
    const { users, name } = req.body
    const { _id } = req.authUser

    const members = JSON.parse(users)
    members.push(_id)

    if (members.length < 3) {
        return res.status(400).json({ message: "at least 3 users required" })
    }

    const chatData = {
        isGroup: true,
        users: members,
        chatName: name,
        groupAdmin: _id,
    }

    const createdChat = await Chat.create(chatData)
    const newChat = await Chat.findOne(createdChat._id).populate("users", "-password").populate("groupAdmin", "-password")

    return res.status(200).json( newChat )
}

//========================================= rename group chat =================================//
export const renameGroupChat = async (req, res, next) => {
    const { chatId, chatName } = req.body
    const { _id } = req.authUser

    const chat = await Chat.findByIdAndUpdate({ _id: chatId, groupAdmin: _id }, { chatName }, { new: true })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
    if (!chat) { return next(new Error('chat not found', { cause: 400 })) }

    return res.status(200).json(chat )
}


//========================================= add to group ==================================//
export const addToGroup = async (req, res, next) => {
    const { chatId, userId } = req.body
    const { _id } = req.authUser

    const chat = await Chat.findByIdAndUpdate({ _id: chatId, groupAdmin: _id }, { $push: { users: userId } }, { new: true })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
    if (!chat) { return next(new Error('chat not found', { cause: 400 })) }

    return res.status(200).json( chat )
}

//========================================= remove from group ==================================//
export const removeFromGroup = async (req, res, next) => {
    const { chatId, userId } = req.body
    const { _id } = req.authUser

    const chat = await Chat.findByIdAndUpdate({ _id: chatId, groupAdmin: _id }, { $pull: { users: userId } }, { new: true })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
    if (!chat) { return next(new Error('chat not found', { cause: 400 })) }

    return res.status(200).json( chat )
}

