import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]
export const jobStatuses = [
  "None",
  "pending",
  "in progress",
  "done",
  "backlog",
  "canceled",
  "OwnerCancelRequest"
]
export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "pending",
    label: "Pending",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]

export const cUSDAddress = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_CUSD_STABLE_TOKEN_ADDRESS : process.env.NEXT_PUBLIC_STABLE_TOKEN_ADDRESS;

export const printTypes = [
  {
    value: "monochrome",
    label: "Black & White",
    price: '0.002', token: {
      'name': 'cUSD',
      'address': cUSDAddress,
    }
  },
  {
    value: "color",
    label: "Color",
    price: '0.005',
    token: {
      'name': 'cUSD',
      'address': cUSDAddress,
    }
  },

]

export const bindTypes = [
  {
    value: "staple",
    label: "Stapled",
    price: '0.00',
    token: {
      'name': 'cUSD',
      'address': cUSDAddress,
      'icon': "https://s2.coinmarketcap.com/static/img/coins/64x64/7236.png"
    }
  },
  {
    value: "bind",
    label: "Bind",
    price: '0.001',
    token: {
      'name': 'cUSD',
      'address': cUSDAddress,
      'icon': "https://s2.coinmarketcap.com/static/img/coins/64x64/7236.png"
    }
  },
]

export const DummyPrinters = [
  {
    hash: 'hash1',
    name: 'Printer Shop',
    description: '',
    latitude: 6.660378631906318,
    longitude: -1.563429887020611
  },
  {
    hash: 'hash2',
    name: 'Printer Shop1',
    description: '',
    latitude: 6.660663691270679,
    longitude: -1.5630275556879887
  },
  {
    hash: 'hash3',
    name: 'Printer Shop 3',
    description: '',
    latitude: 6.660389288334144,
    longitude: -1.562209481978323
  }
]