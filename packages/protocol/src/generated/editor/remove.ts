// @generated by protobuf-ts 2.9.1
// @generated from protobuf file "editor/remove.proto" (package "xyz.unavi.editor.remove", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message xyz.unavi.editor.remove.RemoveNode
 */
export interface RemoveNode {
    /**
     * @generated from protobuf field: string target = 1;
     */
    target: string;
}
/**
 * @generated from protobuf message xyz.unavi.editor.remove.RemoveMesh
 */
export interface RemoveMesh {
    /**
     * @generated from protobuf field: string target = 1;
     */
    target: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class RemoveNode$Type extends MessageType<RemoveNode> {
    constructor() {
        super("xyz.unavi.editor.remove.RemoveNode", [
            { no: 1, name: "target", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<RemoveNode>): RemoveNode {
        const message = { target: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<RemoveNode>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RemoveNode): RemoveNode {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string target */ 1:
                    message.target = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: RemoveNode, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string target = 1; */
        if (message.target !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.target);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message xyz.unavi.editor.remove.RemoveNode
 */
export const RemoveNode = new RemoveNode$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RemoveMesh$Type extends MessageType<RemoveMesh> {
    constructor() {
        super("xyz.unavi.editor.remove.RemoveMesh", [
            { no: 1, name: "target", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<RemoveMesh>): RemoveMesh {
        const message = { target: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<RemoveMesh>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RemoveMesh): RemoveMesh {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string target */ 1:
                    message.target = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: RemoveMesh, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string target = 1; */
        if (message.target !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.target);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message xyz.unavi.editor.remove.RemoveMesh
 */
export const RemoveMesh = new RemoveMesh$Type();