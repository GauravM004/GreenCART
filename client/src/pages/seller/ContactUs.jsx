import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Mail, Trash2, Eye, Download, Filter, Search } from "lucide-react";

const ContactUs = () => {
  const { api } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchMessages();
  }, []);
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/api/contact-us/");
      console.log("API Response:", data);
      if (!data.success) {
        throw new Error("Failed to fetch messages");
      }
      setMessages(data.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages(getMockData());
      toast.error("Using demo data - Connect to your API");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = messages;
    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (sortBy === "latest") {
      filtered = [...filtered].reverse();
    } else if (sortBy === "oldest") {
      filtered = [...filtered];
    }
    setFilteredMessages(filtered);
  }, [messages, searchTerm, sortBy]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/contact-us/${id}`);

      setMessages(messages.filter((msg) => msg._id !== id));
      setSelectedMessage(null);
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      // Fallback to local deletion
      setMessages(messages.filter((msg) => msg._id !== id));
      setSelectedMessage(null);
      toast.success("Message deleted");
    }
  };

  const handleDownload = () => {
    const jsonString = JSON.stringify(filteredMessages, null, 2);
    const element = document.createElement("a");
    element.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(jsonString);
    element.download = `contact-messages-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded as JSON");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Contact Submissions
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Manage all user messages and inquiries
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              disabled={filteredMessages.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {messages.length}
              </div>
              <div className="text-gray-600 text-sm mt-1">Total Messages</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(messages.map((m) => m.email)).size}
              </div>
              <div className="text-gray-600 text-sm mt-1">Unique Senders</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredMessages.length}
              </div>
              <div className="text-gray-600 text-sm mt-1">Showing</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {messages.length > 0 ? (messages.length / 7).toFixed(1) : 0}
              </div>
              <div className="text-gray-600 text-sm mt-1">Per Week</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 mt-4">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {searchTerm
                  ? "No messages match your search"
                  : "No contact messages yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      SR No.
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Message
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg, index) => (
                    <tr
                      key={msg.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {msg.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600">
                        <a
                          href={`mailto:${msg.email}`}
                          className="hover:text-blue-800 underline transition-colors"
                        >
                          {msg.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        <div
                          className="truncate group-hover:text-clip"
                          title={msg.message}
                        >
                          {msg.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                            title="View full message"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-lg max-w-lg w-full p-6 shadow-lg animate-scale-up">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Message Details
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Name
                </label>
                <p className="text-gray-900 mt-1">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <p className="text-blue-600 mt-1">{selectedMessage.email}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Message
                </label>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap break-words bg-gray-100 p-3 rounded-lg">
                  {selectedMessage.message}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Date
                </label>
                <p className="text-gray-600 mt-1">
                  {formatDate(selectedMessage.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <a
                href={`mailto:${selectedMessage.email}`}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition-colors duration-200"
              >
                Reply via Email
              </a>
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-medium transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-up {
          animation: scale-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;
