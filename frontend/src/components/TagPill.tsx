import React from 'react'

export const TagPill: React.FC<{ name: string }> = ({ name }) => (
  <span className="text-xs bg-[#f0f6ec] text-textSecondary px-2 py-1 rounded-full border">{name}</span>
)

export default TagPill
