export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
  DateTime: { input: string; output: string; }
};

export type ChildType = {
  __typename?: 'ChildType';
  age: Scalars['Int']['output'];
  birthDate: Scalars['Date']['output'];
  createdAt: Scalars['DateTime']['output'];
  device?: Maybe<DeviceType>;
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export const ConnectionStatus = {
  Offline: 'OFFLINE',
  Online: 'ONLINE',
  Sleep: 'SLEEP'
} as const;

export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus];
export type CreateChildInput = {
  birthDate: Scalars['Date']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateChildPayload = {
  __typename?: 'CreateChildPayload';
  child?: Maybe<ChildType>;
  errorCode?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DeleteChildPayload = {
  __typename?: 'DeleteChildPayload';
  errorCode?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DeviceType = {
  __typename?: 'DeviceType';
  batteryLevel?: Maybe<Scalars['Int']['output']>;
  childId?: Maybe<Scalars['String']['output']>;
  childName?: Maybe<Scalars['String']['output']>;
  connectionStatus: ConnectionStatus;
  createdAt: Scalars['DateTime']['output'];
  deviceType: Scalars['String']['output'];
  firmwareVersion: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  pairedAt?: Maybe<Scalars['DateTime']['output']>;
  serialNumber: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createChild: CreateChildPayload;
  deleteChild: DeleteChildPayload;
  echo: Scalars['String']['output'];
  registerDevice: RegisterDevicePayload;
  unpairDevice: UnpairDevicePayload;
  updateChild: UpdateChildPayload;
  updateMe: UpdateMePayload;
};


export type MutationCreateChildArgs = {
  input: CreateChildInput;
};


export type MutationDeleteChildArgs = {
  childId: Scalars['String']['input'];
};


export type MutationEchoArgs = {
  message: Scalars['String']['input'];
};


export type MutationRegisterDeviceArgs = {
  input: RegisterDeviceInput;
};


export type MutationUnpairDeviceArgs = {
  deviceId: Scalars['String']['input'];
};


export type MutationUpdateChildArgs = {
  childId: Scalars['String']['input'];
  input: UpdateChildInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};

export const PlanType = {
  Basic: 'BASIC',
  Free: 'FREE',
  Premium: 'PREMIUM'
} as const;

export type PlanType = typeof PlanType[keyof typeof PlanType];
export type Query = {
  __typename?: 'Query';
  child?: Maybe<ChildType>;
  device?: Maybe<DeviceType>;
  hello: Scalars['String']['output'];
  me?: Maybe<UserType>;
  myChildren: Array<ChildType>;
  myDevices: Array<DeviceType>;
  mySubscription?: Maybe<SubscriptionType>;
};


export type QueryChildArgs = {
  id: Scalars['String']['input'];
};


export type QueryDeviceArgs = {
  id: Scalars['String']['input'];
};

export type RegisterDeviceInput = {
  childId: Scalars['String']['input'];
  deviceSecret: Scalars['String']['input'];
  deviceType: Scalars['String']['input'];
  firmwareVersion: Scalars['String']['input'];
  serialNumber: Scalars['String']['input'];
};

export type RegisterDevicePayload = {
  __typename?: 'RegisterDevicePayload';
  device?: Maybe<DeviceType>;
  errorCode?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export const SubscriptionStatus = {
  Active: 'ACTIVE',
  Cancelled: 'CANCELLED',
  Expired: 'EXPIRED',
  Trial: 'TRIAL'
} as const;

export type SubscriptionStatus = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];
export type SubscriptionType = {
  __typename?: 'SubscriptionType';
  autoRenew: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  isExpired: Scalars['Boolean']['output'];
  planType: PlanType;
  startedAt: Scalars['DateTime']['output'];
  status: SubscriptionStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UnpairDevicePayload = {
  __typename?: 'UnpairDevicePayload';
  errorCode?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UpdateChildInput = {
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChildPayload = {
  __typename?: 'UpdateChildPayload';
  child?: Maybe<ChildType>;
  errorCode?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UpdateMeInput = {
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMePayload = {
  __typename?: 'UpdateMePayload';
  errorCode?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<UserType>;
};

export type UserType = {
  __typename?: 'UserType';
  children: Array<ChildType>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  subscription?: Maybe<SubscriptionType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CreateChildMutationVariables = Exact<{
  input: CreateChildInput;
}>;


export type CreateChildMutation = { __typename?: 'Mutation', createChild: { __typename?: 'CreateChildPayload', success: boolean, errorCode?: string | null, errorMessage?: string | null, child?: { __typename?: 'ChildType', id: string, name: string, birthDate: string, gender?: string | null, age: number } | null } };

export type UpdateChildMutationVariables = Exact<{
  childId: Scalars['String']['input'];
  input: UpdateChildInput;
}>;


export type UpdateChildMutation = { __typename?: 'Mutation', updateChild: { __typename?: 'UpdateChildPayload', success: boolean, errorCode?: string | null, errorMessage?: string | null, child?: { __typename?: 'ChildType', id: string, name: string, birthDate: string, gender?: string | null, age: number } | null } };

export type DeleteChildMutationVariables = Exact<{
  childId: Scalars['String']['input'];
}>;


export type DeleteChildMutation = { __typename?: 'Mutation', deleteChild: { __typename?: 'DeleteChildPayload', success: boolean, errorCode?: string | null, errorMessage?: string | null } };

export type RegisterDeviceMutationVariables = Exact<{
  input: RegisterDeviceInput;
}>;


export type RegisterDeviceMutation = { __typename?: 'Mutation', registerDevice: { __typename?: 'RegisterDevicePayload', success: boolean, errorCode?: string | null, errorMessage?: string | null, device?: { __typename?: 'DeviceType', id: string, serialNumber: string, deviceType: string, connectionStatus: ConnectionStatus } | null } };

export type UnpairDeviceMutationVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type UnpairDeviceMutation = { __typename?: 'Mutation', unpairDevice: { __typename?: 'UnpairDevicePayload', success: boolean, errorCode?: string | null, errorMessage?: string | null } };

export type UpdateMeMutationVariables = Exact<{
  input: UpdateMeInput;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'UpdateMePayload', success: boolean, errorCode?: string | null, errorMessage?: string | null, user?: { __typename?: 'UserType', id: string, name?: string | null, phone?: string | null, email: string } | null } };

export type MyDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyDevicesQuery = { __typename?: 'Query', myDevices: Array<{ __typename?: 'DeviceType', id: string, serialNumber: string, deviceType: string, firmwareVersion: string, batteryLevel?: number | null, connectionStatus: ConnectionStatus, isActive: boolean, pairedAt?: string | null, childId?: string | null, childName?: string | null, createdAt: string, updatedAt?: string | null }> };

export type DeviceQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeviceQuery = { __typename?: 'Query', device?: { __typename?: 'DeviceType', id: string, serialNumber: string, deviceType: string, firmwareVersion: string, batteryLevel?: number | null, connectionStatus: ConnectionStatus, isActive: boolean, pairedAt?: string | null, childId?: string | null, childName?: string | null, createdAt: string, updatedAt?: string | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'UserType', id: string, email: string, name?: string | null, phone?: string | null, createdAt?: string | null, updatedAt?: string | null, children: Array<{ __typename?: 'ChildType', id: string, name: string, birthDate: string, gender?: string | null, age: number, isActive: boolean, device?: { __typename?: 'DeviceType', id: string, serialNumber: string, deviceType: string, connectionStatus: ConnectionStatus, batteryLevel?: number | null } | null }>, subscription?: { __typename?: 'SubscriptionType', id: string, planType: PlanType, status: SubscriptionStatus, startedAt: string, expiresAt?: string | null, autoRenew: boolean, isExpired: boolean } | null } | null };

export type MyChildrenQueryVariables = Exact<{ [key: string]: never; }>;


export type MyChildrenQuery = { __typename?: 'Query', myChildren: Array<{ __typename?: 'ChildType', id: string, name: string, birthDate: string, gender?: string | null, age: number, isActive: boolean, createdAt: string, updatedAt?: string | null, device?: { __typename?: 'DeviceType', id: string, serialNumber: string, deviceType: string, firmwareVersion: string, batteryLevel?: number | null, connectionStatus: ConnectionStatus, isActive: boolean, pairedAt?: string | null } | null }> };

export type ChildQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ChildQuery = { __typename?: 'Query', child?: { __typename?: 'ChildType', id: string, name: string, birthDate: string, gender?: string | null, age: number, isActive: boolean, createdAt: string, updatedAt?: string | null, device?: { __typename?: 'DeviceType', id: string, serialNumber: string, deviceType: string, firmwareVersion: string, batteryLevel?: number | null, connectionStatus: ConnectionStatus, isActive: boolean, pairedAt?: string | null } | null } | null };

export type MySubscriptionQueryVariables = Exact<{ [key: string]: never; }>;


export type MySubscriptionQuery = { __typename?: 'Query', mySubscription?: { __typename?: 'SubscriptionType', id: string, planType: PlanType, status: SubscriptionStatus, startedAt: string, expiresAt?: string | null, autoRenew: boolean, isExpired: boolean, createdAt: string, updatedAt?: string | null } | null };
