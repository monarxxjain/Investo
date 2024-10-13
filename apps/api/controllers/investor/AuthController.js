const prisma = require("../../db");
const jwt = require("jsonwebtoken");
const { verifySignedMessage } = require("../../web3-utils/Utils");
const { generateJwtToken } = require("../AuthController");

const registerNewInvestor = async (req, res) => {
  try {
    if (req.investor) {
      return res
        .status(200)
        .json({ error: "You have already registered. Please Log In" });
    }

    const investor = await prisma.investor.create({
      data: {
        wolleteAddr: req.body.wolleteAddr,
      },
    });

    console.log("Successfully Added Investor");

    const result = {
      role: "INVESTOR",
      wolleteAddr: req.body.wolleteAddr
    }

    res
      .cookie("ROLE", "INVESTOR", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .cookie("WOLLETEADDR", req.body.wolleteAddr, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ message: "Successfully Added Investor", investor, result });
  } catch (error) {
    console.log("Error Creating Investor: ", error);

    res.status(401).json({ error: "Error Creating Investor" });
  }
};

const loginInvestorRequest = async (req, res) => {
  try {
    let date = new Date();
    date = date.toISOString();

    let random = Math.random() * 1000000;
    random = random.toString();

    const investor = req.investor;

    const accessString = investor.wolleteAddr + date + random;

    const updatedInvestor = await prisma.investor.update({
      where: {
        wolleteAddr: investor.wolleteAddr,
      },
      data: {
        accessString: accessString,
      },
    });
    
    console.log("AccessString GeneratedSuccessfully")

    res
      .status(200)
      .json({ accessString, message: "AccessString GeneratedSuccessfully" });
  } catch (error) {
    console.log("Error In Requesting Login: ", error);

    res.status(400).json({ error: "Error In Requesting Login" });
  }
};

const loginInvestor = async (req, res) => {
  try {
    const isUserVerified = req.body.wolleteAddr==req.investor.wolleteAddr
    

    if (!isUserVerified) {
      res.status(200).json({ error: "Incorrect User Credentials" });
    } else {
      const userObj = {
        role: "INVESTOR",
        wolleteAddr: req.body.wolleteAddr,
      };
      const token = generateJwtToken(userObj);

      console.log("Investor Logged In Successfully")

      const result = {
        access_token: token,
        role: "INVESTOR",
        wolleteAddr: req.body.wolleteAddr
      }
      
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 86400000
        })
        .cookie("ROLE", "INVESTOR", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 2600000000,
        })
        .cookie("WOLLETEADDR", req.body.wolleteAddr, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 2600000000,
        })
        
        .status(200)
        .json({ message: "Investor Logged In Successfully", result });
    }
  } catch (error) {
    console.log("Error Logging In Investor: ", error);

    res.status(400).json({ error: "Error Logging In Investor" });
  }
};

module.exports = {
  registerNewInvestor,
  loginInvestorRequest,
  loginInvestor,
};
