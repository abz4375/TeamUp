"use server";
import mongoose from "mongoose";
import { User } from "../../../../models/userModel";
import { Project } from "../../../../models/projectModel";

// let user: any;

// mongoose.connect(process.env.MONGODB_URI+'')
//   .then(() => console.log('mongo connected'))
//   .catch(err => console.error('Error connecting to MongoDB:', err));
export default async function Reloader(emailId: any, updatedAt:any) {
  // console.log('reloader ran');
  // let fetch = true;
  // while (fetch){
    try {
      // console.log('reloader ran')
      //   console.log("mongodb connected by reloader");
      const  user  = await User.find({ emailId: emailId });
      // for (const projectId of user.projects){
        //     const project = await Project.findById(projectId);
        //     if(project.updatedAt > new Date()) return true;
        //     else return false;
        // }
        // console.log('reloader of:', emailId, ' last updated at: ',updatedAt, user[0].updatedAt)
        if(updatedAt<user[0].updatedAt) {console.log('update', emailId);return true;} else return false;
        for (let i = 0; i < user[0].projects?.length; i++) {
          const projectId = user[0].projects[i];
          const project = await Project.findById(projectId);
        if ( updatedAt < project.updatedAt) {return true;}
      }
      return false;
      // user.projects.forEach(async(projectId:any)=>{
      // const project = await Project.findById(projectId);
      // if(project.updatedAt > new Date()) return true;
      // else return false;
      // })
      // }
  } catch (error) {
    // console.log("error faced, returning false...");
    return false;
  }
}
