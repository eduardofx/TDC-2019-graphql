import { UserModel } from "../models/UserModel";
import { PostModel } from "../models/PostModel";
import {ComentModel} from "../models/ComentModel";

export type ModelsInterface = {
   User:UserModel
   Post: PostModel
   Comment: ComentModel
}