import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Award, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { skillService } from '@/services/skillService';

const SkillModal = ({ 
  isOpen, 
  onClose, 
  userSkills = [],
  onSuccess 
}) => {
  const [availableSkills, setAvailableSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Fetch available skills on mount
  useEffect(() => {
    if (isOpen) {
      fetchAvailableSkills();
    }
  }, [isOpen]);

  // Filter skills based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = availableSkills.filter(skill =>
        skill?.skill_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(availableSkills);
    }
  }, [searchTerm, availableSkills]);

  const fetchAvailableSkills = async () => {
    setLoadingSkills(true);
    try {
      const response = await skillService.getAvailableSkills();
      
      // Handle different response structures
      let skills = [];
      if (Array.isArray(response)) {
        skills = response;
      } else if (response?.data && Array.isArray(response.data)) {
        skills = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        skills = response.data.data;
      } else if (response?.skills && Array.isArray(response.skills)) {
        skills = response.skills;
      }
      
      if (skills.length === 0) {
        toast.warning('No available skills found. Please check backend.');
      }
      
      // Map backend response (id, name) to frontend format (skill_id, skill_name)
      const mappedSkills = skills.map(skill => ({
        skill_id: skill.id,
        skill_name: skill.name
      }));
      
      // Filter out invalid skills and skills that user already has
      const validSkills = mappedSkills.filter(skill => skill && skill.skill_id && skill.skill_name);
      
      const userSkillIds = userSkills.map(s => s?.skill_id).filter(Boolean);
      const available = validSkills.filter(skill => !userSkillIds.includes(skill.skill_id));
      
      setAvailableSkills(available);
      setFilteredSkills(available);
    } catch (error) {
      
      // Show more detailed error message
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load available skills';
      toast.error(errorMsg);
      
      // If 404, suggest checking backend
      if (error.response?.status === 404) {
        toast.error('Skills endpoint not found. Backend may not be implemented yet.');
      }
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleSelectSkill = (skill) => {
    // Check if already selected
    if (selectedSkills.find(s => s.skill_id === skill.skill_id)) {
      setSelectedSkills(selectedSkills.filter(s => s.skill_id !== skill.skill_id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSelected = (skillId) => {
    setSelectedSkills(selectedSkills.filter(s => s.skill_id !== skillId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }

    setLoading(true);

    try {
      // Add all selected skills
      const promises = selectedSkills.map(skill =>
        skillService.addSkill({
          skill_id: skill.skill_id,
          endorsement_count: 0
        })
      );

      await Promise.all(promises);
      
      toast.success(`${selectedSkills.length} skill(s) added successfully!`);
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error adding skills:', error);
      toast.error(error.message || 'Failed to add skills');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedSkills([]);
      setSearchTerm('');
      onClose();
    }
  };

  const isSelected = (skillId) => {
    return selectedSkills.some(s => s.skill_id === skillId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="w-6 h-6 text-blue-600" />
            Add Skills
          </DialogTitle>
          <DialogDescription>
            Select skills from the list below to add to your profile
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-gray-700 font-semibold">
              Search Skills
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., JavaScript, Python, React..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold">
                Selected Skills ({selectedSkills.length})
              </Label>
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 max-h-24 overflow-y-auto">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill.skill_id}
                    className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 px-3 py-1.5"
                  >
                    {skill.skill_name}
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(skill.skill_id)}
                      className="ml-1 hover:text-blue-200"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Skills List */}
          <div className="flex-1 overflow-hidden flex flex-col space-y-2">
            <Label className="text-gray-700 font-semibold">
              Available Skills ({filteredSkills.length})
            </Label>
            
            {loadingSkills ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredSkills.length > 0 ? (
              <div className="flex-1 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                <div className="flex flex-wrap gap-2">
                  {filteredSkills.map((skill) => (
                    <Badge
                      key={skill.skill_id}
                      onClick={() => handleSelectSkill(skill)}
                      className={`cursor-pointer transition-all ${
                        isSelected(skill.skill_id)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                      }`}
                      variant={isSelected(skill.skill_id) ? 'default' : 'outline'}
                    >
                      {skill.skill_name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 border rounded-lg bg-gray-50">
                <p className="text-gray-500">
                  {searchTerm ? 'No skills found matching your search' : 'No available skills'}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || selectedSkills.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>Add {selectedSkills.length > 0 ? `(${selectedSkills.length})` : ''} Skill{selectedSkills.length !== 1 ? 's' : ''}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SkillModal;
