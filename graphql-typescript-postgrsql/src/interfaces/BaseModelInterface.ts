import { ModelsInterface } from "./ModelsInterface";

export type BaseModelInterface = {
    protype?;
    associate?(models: ModelsInterface): void
}