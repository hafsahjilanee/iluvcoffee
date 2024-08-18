import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


export class EventEntity extends mongoose.Document {
    @Prop()
    type: string;

    @Prop({index: true})
    name: string;

    @Prop(mongoose.SchemaTypes.Mixed)
    payload: Record<string, any>
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({name: 1, type: -1})
