"use client"

import { useState } from "react"
import { clubs as initialClubs, Club } from "@/lib/clubs"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ManagePage() {
  const [clubs, setClubs] = useState<Club[]>(initialClubs)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Club>>({})

  const handleEdit = (club: Club) => {
    setEditingId(club.id)
    setEditForm({ ...club })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSave = () => {
    if (editingId !== null) {
      setClubs(clubs.map(c => 
        c.id === editingId ? { ...c, ...editForm } : c
      ))
      setEditingId(null)
      setEditForm({})
    }
  }

  const handleInputChange = (field: string, value: string | string[] | number | Record<string, { open?: string; close?: string }>) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Manage Clubs</h1>
          <p className="text-gray-400 mb-8">Edit club details and opening times</p>
        </motion.div>

        <div className="grid gap-6">
          {clubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-red-500 transition-colors"
            >
              {editingId === club.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-300 block mb-2">Club Name</label>
                      <Input
                        value={editForm.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 block mb-2">Address</label>
                      <Input
                        value={editForm.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 block mb-2">Postcode</label>
                      <Input
                        value={editForm.postcode || ""}
                        onChange={(e) => handleInputChange("postcode", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 block mb-2">Rating</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editForm.rating || ""}
                        onChange={(e) => handleInputChange("rating", parseFloat(e.target.value))}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-300 block mb-2">Training Days (comma-separated)</label>
                      <Input
                        value={(editForm.training_days || []).join(", ")}
                        onChange={(e) => handleInputChange("training_days", e.target.value.split(",").map(d => d.trim()))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="e.g., Monday, Wednesday, Friday"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-300 block mb-2">Tags (comma-separated)</label>
                      <Input
                        value={(editForm.tags || []).join(", ")}
                        onChange={(e) => handleInputChange("tags", e.target.value.split(",").map(t => t.trim()))}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="e.g., play, inclusive, women"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-300 block mb-3">Opening Times</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                          <div key={day}>
                            <p className="text-xs text-gray-400 mb-2 font-semibold">{day}</p>
                            <div className="space-y-1.5">
                              <Input
                                type="time"
                                value={editForm.opening_times?.[day]?.open || "09:00"}
                                onChange={(e) => handleInputChange("opening_times", {
                                  ...editForm.opening_times,
                                  [day]: { ...editForm.opening_times?.[day], open: e.target.value }
                                })}
                                className="bg-gray-700 border-gray-600 text-white text-sm"
                              />
                              <Input
                                type="time"
                                value={editForm.opening_times?.[day]?.close || "17:00"}
                                onChange={(e) => handleInputChange("opening_times", {
                                  ...(editForm.opening_times || {}),
                                  [day]: { ...(editForm.opening_times?.[day] || {}), close: e.target.value }
                                })}
                                className="bg-gray-700 border-gray-600 text-white text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-3">{club.name}</h2>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><span className="text-gray-400">Address:</span> {club.address || "N/A"}</p>
                      <p><span className="text-gray-400">Postcode:</span> {club.postcode || "N/A"}</p>
                      <p><span className="text-gray-400">Training Days:</span> {club.training_days?.join(", ") || "N/A"}</p>
                      <p><span className="text-gray-400">Rating:</span> {club.rating ? `${club.rating} / 5` : "N/A"}</p>
                      <p><span className="text-gray-400">Tags:</span> {club.tags?.join(", ") || "N/A"}</p>
                      {club.opening_times && Object.keys(club.opening_times).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <p className="text-gray-400 font-semibold mb-2">Opening Times:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(club.opening_times).map(([day, times]) => (
                              <p key={day}><span className="text-gray-500">{day}:</span> {times.open} - {times.close}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleEdit(club)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
