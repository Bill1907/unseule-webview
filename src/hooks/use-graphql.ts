import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { gql, createAuthGraphQLClient } from "@/lib/graphql/client";
import type {
  MeQuery,
  MyChildrenQuery,
  ChildQuery,
  ChildQueryVariables,
  MyDevicesQuery,
  DeviceQuery,
  DeviceQueryVariables,
  MySubscriptionQuery,
  RegisterDeviceMutation,
  RegisterDeviceMutationVariables,
  UnpairDeviceMutation,
  UnpairDeviceMutationVariables,
  CreateChildMutation,
  CreateChildMutationVariables,
  UpdateChildMutation,
  UpdateChildMutationVariables,
  DeleteChildMutation,
  DeleteChildMutationVariables,
  UpdateMeMutation,
  UpdateMeMutationVariables,
} from "@/generated/graphql";

// === Query Documents ===

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      phone
      createdAt
      updatedAt
      children {
        id
        name
        birthDate
        gender
        age
        isActive
        device {
          id
          serialNumber
          deviceType
          connectionStatus
          batteryLevel
        }
      }
      subscription {
        id
        planType
        status
        startedAt
        expiresAt
        autoRenew
        isExpired
      }
    }
  }
`;

const MY_CHILDREN_QUERY = gql`
  query MyChildren {
    myChildren {
      id
      name
      birthDate
      gender
      age
      isActive
      createdAt
      updatedAt
      device {
        id
        serialNumber
        deviceType
        firmwareVersion
        batteryLevel
        connectionStatus
        isActive
        pairedAt
      }
    }
  }
`;

const CHILD_QUERY = gql`
  query Child($id: String!) {
    child(id: $id) {
      id
      name
      birthDate
      gender
      age
      isActive
      createdAt
      updatedAt
      device {
        id
        serialNumber
        deviceType
        firmwareVersion
        batteryLevel
        connectionStatus
        isActive
        pairedAt
      }
    }
  }
`;

const MY_DEVICES_QUERY = gql`
  query MyDevices {
    myDevices {
      id
      serialNumber
      deviceType
      firmwareVersion
      batteryLevel
      connectionStatus
      isActive
      pairedAt
      childId
      childName
      createdAt
      updatedAt
    }
  }
`;

const DEVICE_QUERY = gql`
  query Device($id: String!) {
    device(id: $id) {
      id
      serialNumber
      deviceType
      firmwareVersion
      batteryLevel
      connectionStatus
      isActive
      pairedAt
      childId
      childName
      createdAt
      updatedAt
    }
  }
`;

const MY_SUBSCRIPTION_QUERY = gql`
  query MySubscription {
    mySubscription {
      id
      planType
      status
      startedAt
      expiresAt
      autoRenew
      isExpired
      createdAt
      updatedAt
    }
  }
`;

const REGISTER_DEVICE_MUTATION = gql`
  mutation RegisterDevice($input: RegisterDeviceInput!) {
    registerDevice(input: $input) {
      success
      errorCode
      errorMessage
      device {
        id
        serialNumber
        deviceType
        connectionStatus
      }
    }
  }
`;

const UNPAIR_DEVICE_MUTATION = gql`
  mutation UnpairDevice($deviceId: String!) {
    unpairDevice(deviceId: $deviceId) {
      success
      errorCode
      errorMessage
    }
  }
`;

const CREATE_CHILD_MUTATION = gql`
  mutation CreateChild($input: CreateChildInput!) {
    createChild(input: $input) {
      success
      errorCode
      errorMessage
      child {
        id
        name
        birthDate
        gender
        age
      }
    }
  }
`;

const UPDATE_CHILD_MUTATION = gql`
  mutation UpdateChild($childId: String!, $input: UpdateChildInput!) {
    updateChild(childId: $childId, input: $input) {
      success
      errorCode
      errorMessage
      child {
        id
        name
        birthDate
        gender
        age
      }
    }
  }
`;

const DELETE_CHILD_MUTATION = gql`
  mutation DeleteChild($childId: String!) {
    deleteChild(childId: $childId) {
      success
      errorCode
      errorMessage
    }
  }
`;

const UPDATE_ME_MUTATION = gql`
  mutation UpdateMe($input: UpdateMeInput!) {
    updateMe(input: $input) {
      success
      errorCode
      errorMessage
      user {
        id
        name
        phone
        email
      }
    }
  }
`;

// === Query Hooks ===

export function useMeQuery(
  options?: Omit<UseQueryOptions<MeQuery>, "queryKey" | "queryFn">
) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<MeQuery>(ME_QUERY);
    },
    ...options,
  });
}

export function useMyChildrenQuery(
  options?: Omit<UseQueryOptions<MyChildrenQuery>, "queryKey" | "queryFn">
) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["myChildren"],
    queryFn: async () => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<MyChildrenQuery>(MY_CHILDREN_QUERY);
    },
    ...options,
  });
}

export function useChildQuery(
  variables: ChildQueryVariables,
  options?: Omit<UseQueryOptions<ChildQuery>, "queryKey" | "queryFn">
) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["child", variables.id],
    queryFn: async () => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<ChildQuery>(CHILD_QUERY, variables);
    },
    ...options,
  });
}

export function useMyDevicesQuery(
  options?: Omit<UseQueryOptions<MyDevicesQuery>, "queryKey" | "queryFn">
) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["myDevices"],
    queryFn: async () => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<MyDevicesQuery>(MY_DEVICES_QUERY);
    },
    ...options,
  });
}

export function useDeviceQuery(
  variables: DeviceQueryVariables,
  options?: Omit<UseQueryOptions<DeviceQuery>, "queryKey" | "queryFn">
) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["device", variables.id],
    queryFn: async () => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<DeviceQuery>(DEVICE_QUERY, variables);
    },
    ...options,
  });
}

export function useMySubscriptionQuery(
  options?: Omit<UseQueryOptions<MySubscriptionQuery>, "queryKey" | "queryFn">
) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["mySubscription"],
    queryFn: async () => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<MySubscriptionQuery>(MY_SUBSCRIPTION_QUERY);
    },
    ...options,
  });
}

// === Mutation Hooks ===

export function useRegisterDeviceMutation(
  options?: Omit<
    UseMutationOptions<
      RegisterDeviceMutation,
      Error,
      RegisterDeviceMutationVariables
    >,
    "mutationFn"
  >
) {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (variables: RegisterDeviceMutationVariables) => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<RegisterDeviceMutation>(
        REGISTER_DEVICE_MUTATION,
        variables
      );
    },
    ...options,
  });
}

export function useUnpairDeviceMutation(
  options?: Omit<
    UseMutationOptions<
      UnpairDeviceMutation,
      Error,
      UnpairDeviceMutationVariables
    >,
    "mutationFn"
  >
) {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (variables: UnpairDeviceMutationVariables) => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<UnpairDeviceMutation>(
        UNPAIR_DEVICE_MUTATION,
        variables
      );
    },
    ...options,
  });
}

export function useCreateChildMutation(
  options?: Omit<
    UseMutationOptions<
      CreateChildMutation,
      Error,
      CreateChildMutationVariables
    >,
    "mutationFn"
  >
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: CreateChildMutationVariables) => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<CreateChildMutation>(
        CREATE_CHILD_MUTATION,
        variables
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["myChildren"] });
    },
    ...options,
  });
}

export function useUpdateChildMutation(
  options?: Omit<
    UseMutationOptions<
      UpdateChildMutation,
      Error,
      UpdateChildMutationVariables
    >,
    "mutationFn"
  >
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: UpdateChildMutationVariables) => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<UpdateChildMutation>(
        UPDATE_CHILD_MUTATION,
        variables
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["myChildren"] });
    },
    ...options,
  });
}

export function useDeleteChildMutation(
  options?: Omit<
    UseMutationOptions<
      DeleteChildMutation,
      Error,
      DeleteChildMutationVariables
    >,
    "mutationFn"
  >
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: DeleteChildMutationVariables) => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<DeleteChildMutation>(
        DELETE_CHILD_MUTATION,
        variables
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["myChildren"] });
    },
    ...options,
  });
}

export function useUpdateMeMutation(
  options?: Omit<
    UseMutationOptions<UpdateMeMutation, Error, UpdateMeMutationVariables>,
    "mutationFn"
  >
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: UpdateMeMutationVariables) => {
      const client = await createAuthGraphQLClient(getToken);
      return client.request<UpdateMeMutation>(UPDATE_ME_MUTATION, variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    ...options,
  });
}
