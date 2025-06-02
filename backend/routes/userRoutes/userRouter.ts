import { PrismaClient } from "../../generated/prisma";
import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import userMiddleware from "./userMiddleware";
import { AuthenticatedRequest } from "./userMiddleware";
import { isStringObject } from "util/types";

const prisma = new PrismaClient();
const userRouter = express.Router();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

userRouter.post("/signup", async (req, res): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({
      msg: "Please provide all required fields",
      status: "error",
    });
    return;
  }

  const hashedPassword = await hashPassword(password);

  if (!hashedPassword) {
    res.status(500).json({
      msg: "Password hashing failed",
      status: "error",
    });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });

    if (!user) {
      res.status(400).json({
        msg: "User creation failed",
        status: "error",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string
    );

    res.status(201).json({
      msg: "User created successfully",
      status: "success",
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal server error",
      status: "error",
    });
    return;
  }
});

async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

userRouter.post("/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      msg: "Please provide all required fields",
      status: "error",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(401).json({
        msg: "Invalid email",
        status: "error",
      });
      return;
    }

    if (!(await verifyPassword(password, user.password))) {
      res.status(401).json({
        msg: "Invalid email or password",
        status: "error",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string
    );

    res.status(200).json({
      msg: "Login successful",
      status: "success",
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal server error",
      status: "error",
    });
    return;
  }
});


userRouter.get('/site/:id',userMiddleware, async (req, res) => {
  const siteId = parseInt(req.params.id,10);

  if (isNaN(siteId)) {
    res.status(400).json({
      msg: "Invalid site ID",
      status: "error",
    });
    return;
  }

  try {
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      res.status(404).json({
        msg: "Site not found",
        status: "error",
      });
      return;
    }

    res.status(200).json({
      msg: "Site fetched successfully",
      status: "success",
      data: site,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal server error",
      status: "error",
    });
  }
});

userRouter.put("/site/purchase/:id",userMiddleware,async(req:AuthenticatedRequest,res)=>{
  const siteId = parseInt(req.params.id);

  const userId = req.userId;

   if (isNaN(siteId)) {
    res.status(400).json({
      msg: "Invalid site ID",
      status: "error",
    });
    return;
  }

  try{
    const site = await prisma.site.update({
      where:{
        id:siteId
      },
      data:{
        sold:true
      }
    })

    if(!site){
      res.status(400).json({
        msg:"error buying the property!!",
        status:400
      })
      return ;
    }

    if(!userId){
      res.status(500).json({
        msg:"Internal server Error!!",
        status:500
      });
      return ;
    }

      const purchase = await prisma.purchase.create({
        data:{
          userId:userId,
          siteId:site.id,
          priceSite:site.price,
          productId:1
        }
      })

      if(!purchase){
        res.status(500).json({
          msg:"Internal Server error!!",
          status:500
        });
        return ;
      }

      res.status(200).json({
        msg:"Purhcase Info",
        status:"success",
        purchase:purchase
      });
      return;

  }catch(err){
    res.status(500).json({
      msg:"fatal server error",
      status:500
    });
    return;
  }
})


interface purchases{
  id:number,
  userId:string,
  productId:number,
  siteId:number,
  priceSite:number,
  createdAt:Date,
}

userRouter.get("/purchase-history",userMiddleware,async(req:AuthenticatedRequest,res)=>{
  const userId = req.userId;

  try{
    let purchase:purchases[] = await prisma.purchase.findMany({
      where:{
        userId:userId
      }
    });

    if(!purchase){
      res.status(400).json({
        msg:"Unable to fetch data!!",
        status:'failure',
      });
      return;
    }

    res.status(200).json({
      msg:"Data fetched!!",
      status:"success",
      purchases:purchase
    });
    return;

  }catch(err){
    res.status(500).json({
      msg:"internal server error",
      status:"failure"
    });
    return ;
  }

})

interface sites{
  id:number,
  place:string,
  description:string,
  price:number,
  imageUrl:string,
  contactEmail:string,
  contactPhone:string,
  sold:boolean
}

userRouter.get('/search/:text',userMiddleware,async(req,res)=>{
  const text = req.params.text as string;

  if(!text){
    res.status(500).json({
      msg:"cannot find the entered search text",
      status:"failure",
    });
    return;
  }

  try{
    const site:sites[] = await prisma.site.findMany({
      where:{
        place:{
          startsWith:text,
          mode:'insensitive'
        }
      }
    });
    if(!site){
      res.status(400).json({
        msg:"unable to load!!",
        status:"failure"
      });
      return ;
    }

    res.status(200).json({
      msg:`sites with place like ${text}`,
      status:"success",
      sites:site 
    })
  }catch(err){
    res.status(500).json({
      msg:"internal server error",
      status:"failure",
      error:err
    });
    return ;
  }
})

export default userRouter;