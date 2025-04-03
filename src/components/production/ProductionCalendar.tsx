
import { useState } from 'react';
import { ProductionTaskType } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';

type ProductionCalendarProps = {
  tasks: ProductionTaskType[];
};

const ProductionCalendar = ({ tasks }: ProductionCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Calculate the start of the week (Sunday)
  const startDate = startOfWeek(currentDate);
  
  // Generate dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const days = direction === 'prev' ? -7 : 7;
      return addDays(prev, days);
    });
  };
  
  // Group tasks by day
  const tasksByDay = weekDates.map(date => {
    return {
      date,
      tasks: tasks.filter(task => {
        const scheduledStart = task.scheduledStart ? new Date(task.scheduledStart) : null;
        return scheduledStart && isSameDay(scheduledStart, date);
      })
    };
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Production Schedule</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm font-medium">
            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {weekDates.map((date, index) => (
            <div 
              key={index}
              className={`py-2 px-4 text-center font-medium text-sm border-r last:border-r-0 ${
                isToday(date) ? 'bg-primary/10' : ''
              }`}
            >
              <div className="text-muted-foreground">{format(date, 'EEE')}</div>
              <div className={isToday(date) ? 'text-primary font-bold' : ''}>{format(date, 'MMM d')}</div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 min-h-[300px]">
          {tasksByDay.map((dayData, dayIndex) => (
            <div 
              key={dayIndex} 
              className={`p-2 border-r last:border-r-0 ${
                isToday(dayData.date) ? 'bg-primary/5' : ''
              }`}
            >
              {dayData.tasks.length > 0 ? (
                <div className="space-y-2">
                  {dayData.tasks.map(task => (
                    <div 
                      key={task.id} 
                      className="p-2 rounded bg-card border text-sm"
                    >
                      <div className="font-medium truncate">{task.orderNumber}</div>
                      <div className="text-xs text-muted-foreground truncate">{task.customerName}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs capitalize">{task.taskType.replace('_', ' ')}</span>
                        <StatusBadge status={task.status} className="text-[10px] px-1.5 py-0" />
                      </div>
                      {task.assignedTo && (
                        <div className="text-xs mt-1 text-muted-foreground">
                          Assigned: {task.assignedTo}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No tasks</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductionCalendar;
