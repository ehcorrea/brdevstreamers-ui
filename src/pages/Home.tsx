import React, { useState } from "react";
import useFetch from "react-fetch-hook";
import {
  Box,
  Button,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import LandingLayout from "../components/layouts/LandingLayout";
import Card from "../components/ui/Card";
import { Stream } from "../types/stream.types";
import { FiGrid, FiCoffee } from "react-icons/fi";
import { BsGrid1X2Fill, BsGridFill } from "react-icons/bs";
import { SkeletonListCard } from "../components/sections/SkeletonListCard";
import Mosaic from "../components/sections/Mosaic";

export default function Home() {
  const [isMosaicMode, setIsMosaicMode] = useState(false);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);

  const streamers = useFetch<Stream[]>(
    "https://brstreamers.dev:8000/public/streams",
  );

  const vods = useFetch<Stream[]>("https://brstreamers.dev:8000/public/vods");

  const handleStreamToMosaic = (channelName: string) => {
    const stream = selectedStreams.find((stream) => stream === channelName);
    if (stream) {
      setSelectedStreams(selectedStreams.filter((item) => item !== stream));
    } else {
      setSelectedStreams([...selectedStreams, channelName]);
    }
  };

  return (
    <LandingLayout>
      <HStack mt={8} mb={4}>
        <Box>
          <Heading>Ao vivo</Heading>
          <Text color={"gray.500"}>Prestigie quem está ao vivo!</Text>
        </Box>
        <Spacer />
        <Box>
          <Stack direction="row" spacing={4}>
            <Button
              leftIcon={<FiGrid />}
              variant="solid"
              rounded={"sm"}
              onClick={() => setIsMosaicMode(!isMosaicMode)}
            >
              Simultaneo
            </Button>
            <Button leftIcon={<FiCoffee />} variant="solid" rounded={"sm"}>
              Estou com sorte
            </Button>
          </Stack>
        </Box>
      </HStack>
      {streamers.isLoading ? (
        <SkeletonListCard />
      ) : (
        <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} gap={4}>
          {streamers.data?.map((stream) => (
            <Card
              key={stream.id}
              stream={stream}
              isLive={true}
              isMosaicMode={isMosaicMode}
              handleStreamToMosaic={handleStreamToMosaic}
            />
          ))}
        </SimpleGrid>
      )}

      <Box mt={8} mb={4}>
        <Heading>Transmissões passadas</Heading>
        <Text color={"gray.500"}>Veja o que deixaram gravado!</Text>
      </Box>
      {vods.isLoading ? (
        <SkeletonListCard />
      ) : (
        <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} gap={4}>
          {vods.data?.map((stream) => (
            <Card
              key={stream.id}
              stream={stream}
              isLive={false}
              isMosaicMode={false}
            />
          ))}
        </SimpleGrid>
      )}

      {isMosaicMode && <Mosaic channels={selectedStreams} />}
    </LandingLayout>
  );
}
