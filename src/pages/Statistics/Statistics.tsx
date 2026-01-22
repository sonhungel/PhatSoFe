import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { GetQueueLogsByDateRange, type VnptPhatSoStatiticsWeeklyByRoom } from '../../services/queueLogService';
import { getDonvis } from '../../services/managementService';
import type { VnptDonvi } from '../../openAPIGenerate';
import { removeToken } from '../../utils/auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const navigate = useNavigate();
  const [roomStatistics, setRoomStatistics] = useState<VnptPhatSoStatiticsWeeklyByRoom[]>([]);
  const [donviData, setDonviData] = useState<VnptDonvi[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonvi, setSelectedDonvi] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<VnptPhatSoStatiticsWeeklyByRoom | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState('');

  // Load donvi data on component mount
  useEffect(() => {
    loadDonviData();
  }, []);

  // Load statistics when both donvi and week are selected
  useEffect(() => {
    if (selectedDonvi && selectedWeek) {
      loadStatistics();
    }
  }, [selectedDonvi, selectedWeek]);

  const loadDonviData = async () => {
    try {
      const donvis = await getDonvis();
      setDonviData(donvis);
    } catch (err) {
      console.error('Error loading donvi data:', err);
      setError('Failed to load donvi data');
    }
  };

  // Generate week options for the last 12 weeks
  const generateWeekOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));

      // Set to Monday of that week (start of week)
      const dayOfWeek = weekStart.getDay();
      const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      weekStart.setDate(diff);

      const label = `Tuần ${weekStart.toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })}`;

      options.push({
        label,
        value: weekStart.toISOString().split('T')[0]
      });
    }

    return options;
  };

  const weekOptions = generateWeekOptions();

  const loadStatistics = async () => {
    if (!selectedDonvi || !selectedWeek) return;

    setLoading(true);
    setError('');

    try {
      const startDate = selectedWeek;
      const endDate = new Date(selectedWeek);
      endDate.setDate(endDate.getDate() + 6); // Add 6 days to get end of week
      const endDateStr = endDate.toISOString().split('T')[0];

      const stats = await GetQueueLogsByDateRange({
        donviId: parseInt(selectedDonvi),
        startDate,
        endDate: endDateStr
      });
      console.log('Loaded statistics:', stats.map(s => s.weekCount));
      setRoomStatistics(stats);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error loading statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBarClick = (_event: any, elements: any, _chart: any) => {
    if (elements.length > 0) {
      const dataIndex = elements[0].index;
      const selectedRoom = roomStatistics[dataIndex];
      if (selectedRoom) {
        setSelectedRoomDetails(selectedRoom);
        setShowDetails(true);
      }
    }
  };

  const chartData = {
    labels: roomStatistics.map(stat => stat.roomName),
    datasets: [
      {
        label: 'Thống kê tuần cho từng phòng',
        data: roomStatistics.map(stat => stat.weekCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    onClick: handleBarClick,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Thống kê của trong cho tuần được chọn (${roomStatistics.length} phòng)`,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const room = roomStatistics[context.dataIndex];
            return [
              `Phòng: ${room.roomName}`,
              `Số lượng: ${context.parsed.y}`,
              `Mã phòng: ${room.roomId}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượng'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tên phòng'
        }
      }
    },
  };

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <div className="h-screen w-screen bg-gray-100 fixed top-0 left-0 m-0 p-0 overflow-y-auto">
      <header className="bg-white p-4 md:px-8 shadow-md flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 m-0">Thống kê phòng</h1>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer text-sm transition-colors" onClick={handleLogout}>
          Đăng xuất
        </button>
      </header>

      <nav className="bg-white px-4 md:px-8 border-b border-gray-200 flex gap-0">
        <button
          className="px-4 md:px-6 py-4 border-b-4 transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-transparent"
          onClick={() => navigate('/management')}
        >
          ← Trở về trang quản trị
        </button>
      </nav>

      <main className="p-4 md:p-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="donviSelect" className="text-sm font-medium text-gray-700">Chọn đơn vị:</label>
              <select
                id="donviSelect"
                value={selectedDonvi}
                onChange={(e) => setSelectedDonvi(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm max-w-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Chọn 1 đơn vị...</option>
                {donviData.map((donvi) => (
                  <option key={donvi.id} value={donvi.id}>
                    {donvi.tenDonvi}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="weekSelect" className="text-sm font-medium text-gray-700">Chọn tuần:</label>
              <select
                id="weekSelect"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm max-w-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={!selectedDonvi}
              >
                <option value="">Chọn 1 tuần...</option>
                {weekOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 border border-red-200">{error}</div>}

        {loading && <div className="text-center p-8 text-gray-600 text-lg">Loading statistics...</div>}

        {roomStatistics.length > 0 && !loading && (
          <div className="bg-white p-2 rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="flex justify-center items-center">
              <div className="w-full max-w-4xl">
                <Bar
                  data={chartData}
                  options={chartOptions}
                />
                <p className="text-center text-gray-600 italic mt-4">
                  Click trên thanh thống kê để xem chi tiết phòng.
                </p>
              </div>
            </div>
          </div>
        )}

        {showDetails && selectedRoomDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setShowDetails(false)}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 m-0">Thống kê room chi tiết</h3>
                <button
                  className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-700">Tên phòng:</span>
                    <span className="text-gray-600 font-mono">{selectedRoomDetails.roomName}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-700">Room ID:</span>
                    <span className="text-gray-600 font-mono">{selectedRoomDetails.roomId}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-700">Donvi ID:</span>
                    <span className="text-gray-600 font-mono">{selectedRoomDetails.donviId}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-700">Số lượng:</span>
                    <span className="text-gray-600 font-mono">{selectedRoomDetails.weekCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Statistics;