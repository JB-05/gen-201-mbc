'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    teamName: '',
    teamLeader: '',
    email: '',
    phone: '',
    institution: '',
    members: ['', '', ''],
    projectIdea: '',
    technologies: '',
    experience: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block font-orbitron font-black text-2xl mb-8 hover:text-gray-300 transition-colors">
            ← BACK TO GEN <span className="text-gray-400">201</span>
          </Link>
          <h1 className="font-orbitron font-black text-4xl md:text-5xl mb-6 tracking-wider">
            TEAM <span className="text-gray-400">REGISTRATION</span>
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-8 clip-polygon"></div>
          <p className="text-gray-300 text-lg">
            Join the ranks of tomorrow's innovators. Complete your registration to secure your spot in GEN 201.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gradient-futuristic border border-gray-700 p-8 clip-polygon">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-orbitron font-bold text-xl mb-6">TEAM INFORMATION</h3>
              <div className="space-y-6">
                <div>
                  <label className="block font-orbitron font-bold text-sm text-gray-400 mb-2">TEAM NAME</label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-orbitron font-bold text-sm text-gray-400 mb-2">TEAM LEADER</label>
                  <input
                    type="text"
                    name="teamLeader"
                    value={formData.teamLeader}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-orbitron font-bold text-sm text-gray-400 mb-2">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-orbitron font-bold text-sm text-gray-400 mb-2">PHONE</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-orbitron font-bold text-sm text-gray-400 mb-2">INSTITUTION</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-orbitron font-bold text-xl mb-6">TEAM MEMBERS</h3>
              <div className="space-y-6">
                {formData.members.map((member, index) => (
                  <div key={index}>
                    <label className="block font-orbitron font-bold text-sm text-gray-400 mb-2">
                      MEMBER {index + 2} {index > 0 && '(OPTIONAL)'}
                    </label>
                    <input
                      type="text"
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      className="w-full bg-black border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white"
                      placeholder="Full Name"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block font-orbitron font-bold text-sm text-gray-400 mb-2">PROJECT IDEA</label>
              <textarea
                name="projectIdea"
                value={formData.projectIdea}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-black border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white resize-none"
                placeholder="Describe your project idea or the problem you want to solve..."
                required
              />
            </div>
            <div>
              <label className="block font-orbitron font-bold text-sm text-gray-400 mb-2">PREFERRED TECHNOLOGIES</label>
              <input
                type="text"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                className="w-full bg-black border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white"
                placeholder="e.g., React, Python, AI/ML, Blockchain..."
              />
            </div>
            <div>
              <label className="block font-orbitron font-bold text-sm text-gray-400 mb-2">TEAM EXPERIENCE</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-black border border-gray-700 p-3 clip-polygon focus:border-white focus:outline-none text-white resize-none"
                placeholder="Brief overview of your team's technical background and experience..."
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="bg-white text-black px-12 py-4 clip-arrow font-orbitron font-bold text-lg hover:bg-gray-200 transition-colors duration-200"
            >
              REGISTER TEAM
            </button>
            <p className="text-gray-400 text-sm mt-4">
              Registration closes on September 20, 2025
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}