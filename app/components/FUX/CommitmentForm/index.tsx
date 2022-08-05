import { useFux } from "../../../contexts/FuxProvider";
import {
  Button,
  FormControl,
  Grid,
  GridItem,
  Heading,
  VStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  Text,
  HStack,
  Center,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  workstream: Partial<Workstream>;
};

const CommitmentForm: React.FC<{
  workstream: Partial<Workstream>;
}> = ({ workstream }) => {
  const { updateWorkstream } = useFux();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      workstream,
    },
  });

  const handleSubmitCommitment = (data: FormData) => {
    const ratings = data.workstream.contributors?.map((contributor) => ({
      address: contributor.address,
      commitmentRating: contributor.commitmentRating,
    }));

    console.log("Commitment ratings: ", ratings);
    updateWorkstream({ ...data.workstream, commitmentRatingSubmitted: true });
  };

  const onReset = () => {
    reset({ workstream });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitCommitment)}>
      <FormControl>
        <Grid gap={2} templateColumns="repeat(10, 1fr)">
          {workstream?.contributors
            ? workstream.contributors.map((contributor, index) => (
                <>
                  <GridItem
                    display={"flex"}
                    alignItems={"center"}
                    bg="#301A3A"
                    colSpan={6}
                  >
                    <Text pl={"1em"}>{contributor?.address}</Text>
                  </GridItem>
                  <GridItem
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    bg="#301A3A"
                    colSpan={2}
                  >
                    <Text pr={"1em"}>{`${
                      contributor?.allocation || 0
                    } %`}</Text>
                  </GridItem>
                  <GridItem
                    bg="#301A3A"
                    display={"flex"}
                    alignItems={"center"}
                    colSpan={2}
                  >
                    <Controller
                      name={`workstream.contributors.${index}.commitmentRating`}
                      control={control}
                      rules={{ required: true }}
                      key={`workstream.contributors.${index}.commitmentRating`}
                      render={({ field: { ref, onChange, ...restField } }) => (
                        <NumberInput onChange={onChange} {...restField}>
                          <NumberInputField
                            ref={ref}
                            name={restField.name}
                            borderRadius={0}
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                  </GridItem>
                </>
              ))
            : "No contributors found"}
        </Grid>
      </FormControl>

      <HStack w={"100%"} pt={4}>
        <Button isLoading={isSubmitting} type="reset" onClick={onReset}>
          Reset
        </Button>
        <Spacer />

        <Text>Assign 100% of your FUX to give</Text>
        <Spacer />

        <Button isLoading={isSubmitting} type="submit">
          Submit allocation
        </Button>
      </HStack>
    </form>
  );
};

export { CommitmentForm };
