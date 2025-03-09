import User from "../models/User.js";


export const createUser = async function (req, res) {
	try {
        const { user_name, user_tag, user_bio, is_admin } = req.body;
        
        const newUser = new User({
            user_name,
            user_tag,
            user_bio,
            is_admin,
        });

        await newUser.save();
        res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async function (req, res) {
	try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

export const getUser = async function (req, res) {
	try {
		console.log("Fetching user with ID:", req.params.id); // Debugging line
	
		const user = await User.findById(req.params.id);
		if (!user) {
		  return res.status(404).json({ message: "User not found" });
		}
	
		res.status(200).json({
		  user_id: user._id,
		  user_name: user.user_name,
		  user_tag: user.user_tag,
		  user_bio: user.user_bio,
		  is_admin: user.is_admin,
		});
	  } catch (error) {
		console.error("Error fetching user:", error.message);
		res.status(500).json({ message: "Error getting user.", error: error.message });
	  }
	  
  };