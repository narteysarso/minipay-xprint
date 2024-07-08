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

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
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

export const printTypes = [
  {
    value: "monochrome", label: "Black & White", price: '0.002', token: {
      'name': 'cUSD',
      'address': "",
    }
  },
  {
    value: "color", label: "Color", price: '0.02', token: {
      'name': 'cUSD',
      'address': "",
    }
  },

]

export const bindTypes = [
  {
    value: "staple", label: "Stapled", price: '0.00', token: {
      'name': 'cUSD',
      'address': "",
      'icon': "https://s2.coinmarketcap.com/static/img/coins/64x64/7236.png"
    }
  },
  {
    value: "bind", label: "Bind", price: '0.1', token: {
      'name': 'cUSD',
      'address': "",
      'icon': "https://s2.coinmarketcap.com/static/img/coins/64x64/7236.png"
    }
  },
]