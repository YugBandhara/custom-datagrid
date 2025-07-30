"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { ViewRowModalProps } from "@/types/DataGrid/DataGridModal.types";



export default function ViewRowModal({ isOpen, onClose, user }: ViewRowModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center p-6 text-center">
        {user.avatar && (
          <img src={user.avatar} alt={user.name || "Avatar"} className="w-24 h-24 rounded-full mb-4" />
        )}
        {user.name && <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>}
        {user.email && (
          <p style={{ color: "var(--color-text-muted)" }} className="text-sm">
            {user.email}
          </p>
        )}

        <div className="w-full mt-6 space-y-4 text-left">
          {Object.entries(user)
            .filter(([key]) => !["name", "email", "avatar"].includes(key))
            .map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

              return (
                <div
                  key={key}
                  className="flex justify-between items-center border-b pb-2 text-sm"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span style={{ color: "var(--color-text-muted)" }} className="font-medium">
                    {label}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full capitalize font-semibold text-xs ${
                      key === "status" ? "bg-green-100 text-green-800" : ""
                    }`}
                  >
                    {String(value)}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
