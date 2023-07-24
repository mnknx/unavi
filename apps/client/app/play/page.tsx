import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { z } from "zod";

import { WORLD_ID_LENGTH } from "@/src/server/db/constants";
import { fetchWorld } from "@/src/server/helpers/fetchWorld";
import { generateWorldMetadata } from "@/src/server/helpers/generateWorldMetadata";

import App from "./App";
import { WorldUriId } from "./types";

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = searchParamsSchema.safeParse(searchParams);
  if (!params.success) return {};

  const id = parseParams(params.data);

  return await generateWorldMetadata(id.value);
}

export default async function Play({ searchParams }: Props) {
  // Call cookies() to force this route to be dynamic
  // It should be dynamic because of searchParams, but it's not due to a bug in Next.js
  cookies();

  const params = searchParamsSchema.safeParse(searchParams);
  if (!params.success) return notFound();

  const id = parseParams(params.data);
  const world = await fetchWorld(id);

  if (!world?.metadata) notFound();

  return <App id={id} uri={world.uri} metadata={world.metadata} />;
}

function parseParams(params: Params): WorldUriId {
  if ("id" in params) return { type: "id", value: params.id };
  else return { type: "uri", value: params.uri };
}

const httpsSchema = z.string().refine((param) => param.startsWith("https://"));

const idSchema = z.string().refine((param) => {
  return param.length === WORLD_ID_LENGTH;
});

const searchParamsSchema = z.union([
  z.object({ id: idSchema }),
  z.object({ uri: httpsSchema }),
]);

type Params = z.infer<typeof searchParamsSchema>;
